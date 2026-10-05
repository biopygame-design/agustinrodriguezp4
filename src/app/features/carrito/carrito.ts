import { Component, inject, signal, computed } from '@angular/core'; // 👈 Asegurate de importar signal y computed si no los tenías
import { ServicioCarrito } from '../../core/service/servicio-carrito/servicio-carrito';
import { AuthService } from '../../core/service/authservice/authservice';
import { ButacasService } from '../../service/butacas-service/butacas-service';
import { UpperCasePipe, CommonModule } from '@angular/common'; // 👈 Agregá CommonModule
import { FormsModule } from '@angular/forms'; // 👈 Agregá FormsModule para el checkbox
import jsPDF from 'jspdf';

@Component({
  imports: [CommonModule, FormsModule, UpperCasePipe], // 👈 Incluilos acá
  selector: 'app-carrito',
  styleUrl: './carrito.css',
  templateUrl: './carrito.html',
})
export class Carrito {
  cartService = inject(ServicioCarrito);
  authService = inject(AuthService);
  butacasService = inject(ButacasService);
  tieneCredito = computed(() => (this.usuarioActual()?.credito || 0) > 0);
  creditoDisponible = computed(() => this.usuarioActual()?.credito || 0);

  // 🟢 1. Estado para el checkbox de usar crédito
  usarCredito = signal<boolean>(false);
  usuarioActual = this.authService.currentUserData;

  // 🟢 2. Calculamos cuánto crédito se va a usar según lo que tenga disponible y el total del carrito
  creditoAUsar = computed(() => {
    if (!this.usarCredito()) return 0;
    const creditoDisponible = this.usuarioActual()?.credito || 0;
    const totalCarrito = this.cartService.precioFinal();
    return Math.min(creditoDisponible, totalCarrito);
  });

  // 🟢 3. Total final restando el crédito seleccionado
  totalConCredito = computed(() => {
    return Math.max(0, this.cartService.precioFinal() - this.creditoAUsar());
  });

  async finalizarCompra() {
    const items = this.cartService.items();
    if (items.length === 0) return;

    const usuario = this.usuarioActual();
    const userId = usuario?.id || 'usuario-anonimo';
    const montoCredito = this.creditoAUsar();

    // 🟢 4. Si decidió usar crédito, lo descontamos de su cuenta en Supabase/Auth
    if (montoCredito > 0) {
      await this.authService.gastarCredito(montoCredito);
    }

    // 5. Recorremos los ítems para procesar entradas (Supabase + PDF)
    for (const item of items) {
      if (item.tipo === 'entrada' && item.detalles?.idsButacas) {
        const codigoReserva = 'CINE-UTN-' + Math.floor(100000 + Math.random() * 900000);
        
        const fechaHoraFuncion = item.detalles.fecha && item.detalles.horario 
          ? `${item.detalles.fecha} ${item.detalles.horario}` 
          : undefined;

        const resultado = await this.butacasService.confirmarCompraYOcuparButacas(
          item.detalles.idsButacas,
          userId,
          Number(item.detalles.funcionId),
          codigoReserva,
          item.detalles.nombresButacas || '',
          item.precio,
          fechaHoraFuncion
        );

        if (resultado?.exito) {
          await this.generarComprobantePDF(
            item,
            usuario,
            codigoReserva,
            item.detalles.nombresButacas || '',
            this.totalConCredito()
          );
        }
      }
    }

    // 6. Procesar canje de puntos de combos si los hubiera
    for (const item of items) {
      if (item.tipo === 'combo_canje' && item.puntosNecesarios) {
        if (usuario) {
          const puntosNuevos = (usuario.puntos || 0) - (item.puntosNecesarios * item.cantidad);
          await this.authService.actualizarPuntosUsuario(puntosNuevos); 
        }
      }
    }

    // 7. Sumar puntos por la compra actual (sobre el total final real)
    const puntosGanados = Math.floor(this.totalConCredito() * 0.10);
    
    if (this.authService.currentUser() && this.totalConCredito() > 0) {
       await this.authService.sumarPuntos(puntosGanados);
    }
    if (this.authService.tieneDescuentoPrimeraCompra) {
      await this.authService.usarCuponPrimeraCompra();
    }

    alert(`¡Compra procesada con éxito!${montoCredito > 0 ? ` (Se usaron $${montoCredito} de tu crédito)` : ''}`);
    this.cartService.vaciarCarrito(); 
    this.cartService.limpiarPromoTrasCompra();
    this.usarCredito.set(false);
  }
  private async convertirImagenABase64(url: string): Promise<string> {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  private async generarComprobantePDF(
    item: any,
    usuario: any,
    codigoReserva: string,
    nombresButacas: string,
    totalPagar: number
  ) {
    const doc = new jsPDF();
    const fechaActual = new Date().toLocaleDateString();
    const urlAPIQR = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(codigoReserva)}`;

    doc.setFillColor(30, 41, 59);
    doc.rect(0, 0, 210, 35, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.text('COMPROBANTE DE ENTRADA - CINE UTN', 15, 22);

    doc.setTextColor(50, 50, 50);
    doc.setFontSize(12);
    doc.text(`Código de Reserva: ${codigoReserva}`, 15, 50);
    doc.text(`Fecha de Emisión: ${fechaActual}`, 15, 60);
    doc.text(`Cliente: ${usuario?.nombre || 'Invitado'} ${usuario?.apellido || ''}`, 15, 70);

    doc.line(15, 80, 195, 80);

    doc.setFontSize(14);
    doc.text('Detalle de la Función:', 15, 95);
    doc.setFontSize(11);
    doc.text(`Asientos Seleccionados: ${nombresButacas}`, 15, 105);
    doc.text(`Formato: ${item.detalles?.formato || '2D'}`, 15, 115);
    doc.text(`Horario: ${item.detalles?.horario || '--'}`, 15, 125);
    
    doc.setFont('helvetica', 'bold');
    doc.text(`TOTAL PAGADO: $${totalPagar}`, 15, 145);
    doc.setFont('helvetica', 'normal');

    try {
      const qrBase64 = await this.convertirImagenABase64(urlAPIQR);
      doc.addImage(qrBase64, 'PNG', 135, 90, 50, 50);
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text('Presentá este QR en boletería', 135, 145);
    } catch (e) {
      console.error('No se pudo cargar el QR en el PDF', e);
    }

    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text('¡Gracias por elegirnos! Disfrutá de tu función.', 15, 180);

    doc.save(`Entrada_${codigoReserva}.pdf`);
  }
}
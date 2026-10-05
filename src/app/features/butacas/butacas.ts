import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ButacasService } from '../../service/butacas-service/butacas-service';
import { Butacamodelo } from '../../core/models/butacamodelo/butacamodelo';
import { AuthService } from '../../core/service/authservice/authservice';
import { ServicioCarrito } from '../../core/service/servicio-carrito/servicio-carrito';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-butacas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './butacas.html',
  styleUrl: './butacas.css'
})
export class Butacas {
  butacasService = inject(ButacasService);
  authService = inject(AuthService);
  route = inject(ActivatedRoute);
  carroservicio = inject(ServicioCarrito);

  funcionId: number = 0;
  
  formatoSeleccionado: string = '2D Digital';
  horarioSeleccionado: string = '20:00 hs';
  
  precioUnitario = signal<number>(4000);
  butacasSeleccionadasList = signal<Butacamodelo[]>([]);
  
  butacas = this.butacasService.butacas;
  butacasAgrupadas = computed(() => {
    const map = new Map<string, Butacamodelo[]>();
    for (const b of this.butacas()) {
      if (!map.has(b.fila)) {
        map.set(b.fila, []);
      }
      map.get(b.fila)!.push(b);
    }
    
    // Ordenamos cada fila por su número de asiento de menor a mayor
    map.forEach((asientos) => {
      asientos.sort((a, b) => a.numero - b.numero);
    });

    // Devolvemos un array ordenado alfabéticamente por la letra de la fila (A, B, C...)
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  });

  // 🟢 Única declaración de los cálculos computados
  subtotal = computed(() => {
    return this.butacasSeleccionadasList().reduce((acc, b) => {
      const precio = b.tipo === 'vip' ? 6500 : this.precioUnitario();
      return acc + precio;
    }, 0);
  });

  descuento = computed(() => {
    if (this.authService.tieneDescuentoPrimeraCompra) {
      return this.subtotal() * 0.20; 
    }
    return 0; 
  });

  totalFinal = computed(() => {
    return this.subtotal() - this.descuento();
  });

  async ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.funcionId = Number(idParam);
      await this.butacasService.cargarButacas(this.funcionId);
    }
  }

  esSeleccionada(butacaId: number): boolean {
    return this.butacasSeleccionadasList().some(b => b.id === butacaId);
  }

  seleccionarButaca(butaca: Butacamodelo) {
    if (butaca.estado !== 'libre') return;

    const listaActual = this.butacasSeleccionadasList();
    const index = listaActual.findIndex(b => b.id === butaca.id);

    if (index !== -1) {
      this.butacasSeleccionadasList.set(listaActual.filter(b => b.id !== butaca.id));
    } else {
      this.butacasSeleccionadasList.set([...listaActual, butaca]);
    }
  }

  agregarAlCarrito() {
    const seleccionadas = this.butacasSeleccionadasList();
    if (seleccionadas.length === 0) return;

    const idsButacas = seleccionadas.map(b => b.id);
    const nombresButacas = seleccionadas.map(b => `${b.fila}${b.numero}`).join(', ');
    
    const totalPagar = this.totalFinal();
    const precioUnitarioFinal = totalPagar / seleccionadas.length; 

    this.carroservicio.agregarAlCarrito({
      id: `funcion-${this.funcionId}-${Date.now()}`,
      tipo: 'entrada',
      titulo: `Entradas de Cine (Función #${this.funcionId})`,
      precio: precioUnitarioFinal,
      cantidad: seleccionadas.length,
      detalles: {
        funcionId: String(this.funcionId),
        horario: this.horarioSeleccionado,
        formato: this.formatoSeleccionado,
        idsButacas: idsButacas,
        nombresButacas: nombresButacas
      }
    });

   

    alert('¡Entradas agregadas al carrito con éxito! 🛒');
    this.butacasSeleccionadasList.set([]);
  }
}
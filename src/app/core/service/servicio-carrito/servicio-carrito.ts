import { computed, inject, Injectable, signal } from '@angular/core';
import { AuthService } from '../authservice/authservice';
import { Promomodelo } from '../../models/promomodelo/promomodelo';

@Injectable({
  providedIn: 'root'
})
export class ServicioCarrito {
  private authService = inject(AuthService);

  items = signal<any[]>(this.cargarDelLocalStorage());
  promoAplicada = signal<Promomodelo | null>(this.cargarPromoDelLocalStorage());

  // Cantidad total de productos / ítems en el carrito
  cantidadTotal = computed(() => 
    this.items().reduce((acc, item) => acc + (item.cantidad || 1), 0)
  );

  // Subtotal de todos los productos en el carrito
  precioTotal = computed(() => {
    return this.items().reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
  });

  subtotal = computed(() => this.precioTotal());

  // Cálculo del monto de descuento basado en el porcentaje de la promo
  montoDescuento = computed(() => {
    const promo = this.promoAplicada();
    if (!promo) return 0;

    const porcentaje = Number(promo.descuento_porcentaje || 0);
    if (porcentaje > 0) {
      return (this.precioTotal() * porcentaje) / 100;
    }
    return 0;
  });

  descuentoPromo = computed(() => this.montoDescuento());

  // Precio final restando el descuento (nunca menor a 0)
  precioFinal = computed(() => {
    return Math.max(0, this.precioTotal() - this.montoDescuento());
  });

  private guardarEnLocalStorage(items: any[]) {
    localStorage.setItem('carrito_cine_utn', JSON.stringify(items));
  }

  private cargarDelLocalStorage(): any[] {
    const guardado = localStorage.getItem('carrito_cine_utn');
    return guardado ? JSON.parse(guardado) : [];
  }

  private cargarPromoDelLocalStorage(): Promomodelo | null {
    const guardado = localStorage.getItem('promo_cine_utn');
    return guardado ? JSON.parse(guardado) : null;
  }

  agregarAlCarrito(item: any) {
<<<<<<< HEAD
    
=======
>>>>>>> dd3b82963917c9df8e99f6fb50eddd8acc520040
    this.items.update(currentItems => {
      const nuevosItems = [...currentItems, item];
      this.guardarEnLocalStorage(nuevosItems);
      return nuevosItems;
    });
  }

  // Método para eliminar un ítem específico del carrito por su ID
  eliminarItem(id: string) {
    this.items.update(currentItems => {
      const nuevosItems = currentItems.filter(i => i.id !== id);
      this.guardarEnLocalStorage(nuevosItems);
      return nuevosItems;
    });
  }

  aplicarPromoDescuento(promo: Promomodelo) {
    this.promoAplicada.set(promo);
    localStorage.setItem('promo_cine_utn', JSON.stringify(promo));
  }

  aplicarPromoCanjeada(porcentaje: number) {
    const promoSimulada: Promomodelo = {
      id: 'custom',
      titulo: 'Cupón Canjeado',
      tipo: 'puntos',
      descuento_porcentaje: porcentaje,
      activo: true
    } as Promomodelo;
    this.aplicarPromoDescuento(promoSimulada);
  }

  quitarPromo() {
    this.promoAplicada.set(null);
    localStorage.removeItem('promo_cine_utn');
  }

  limpiarPromoTrasCompra() {
    this.quitarPromo();
  }

  vaciarCarrito() {
    this.items.set([]);
    localStorage.removeItem('carrito_cine_utn');
    this.limpiarPromoTrasCompra();
  }
}
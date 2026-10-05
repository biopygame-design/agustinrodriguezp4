import { Component, inject, signal } from '@angular/core';
import { Promosservicio } from '../../core/service/promosservicio/promosservicio';
import { AuthService } from '../../core/service/authservice/authservice';
import { Promomodelo } from '../../core/models/promomodelo/promomodelo';
import { CommonModule } from '@angular/common';
import { ServicioCarrito } from '../../core/service/servicio-carrito/servicio-carrito';
import { Router } from '@angular/router';


@Component({
  imports: [CommonModule],
  selector: 'app-listapromos',
  styleUrl: './listapromos.css',
  templateUrl: './listapromos.html',
})
export class Listapromos {
  private router = inject(Router);
  promos = signal<Promomodelo[]>([]);

  constructor(
    private promosService: Promosservicio,
    private authService: AuthService,
    private servicioCarrito: ServicioCarrito
  ) {
    this.cargarPromos();
  }

  private async cargarPromos() {
    const listado = await this.promosService.obtenerPromos();
    this.promos.set(listado);
  }

  async canjearPromo(promo: Promomodelo) {
    const usuario = this.authService.currentUserData();

    if (!usuario) {
      alert('Debes iniciar sesión para canjear una promoción.');
      return;
    }

    // 1. Validar si la promo requiere puntos
    const puntosUsuario = usuario.puntos || 0;
    const necesarios = promo.puntos_necesarios || 0;

    if (necesarios > 0 && puntosUsuario < necesarios) {
      alert(`❌ No tenés suficientes puntos. Necesitás ${necesarios} puntos y tenés ${puntosUsuario}.`);
      return;
    }

    // 2. Si requiere puntos, se los descontamos al usuario
    if (necesarios > 0) {
      const nuevosPuntos = puntosUsuario - necesarios;
      await this.authService.actualizarPuntosUsuario(nuevosPuntos);
    }

    // 3. Si la promo tiene porcentaje de descuento, lo aplicamos al carrito
    if (promo.descuento_porcentaje) {
      this.servicioCarrito.aplicarPromoDescuento(promo);
    }

    alert(`¡Canje exitoso! Se aplicó un ${promo.descuento_porcentaje || 0}% de descuento.`);
    
    // 4. Redirigir al carrito para ver el descuento reflejado
    this.router.navigate(['/carrito']);
  }
}
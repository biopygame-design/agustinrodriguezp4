import { Component, input, signal, effect, inject } from '@angular/core';
import { Candyservice } from '../../service/candyservice/candyservice';
import { Router } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { candyinterface } from '../../core/models/candyinterface/candyinterface';
import { UpperCasePipe } from '@angular/common';

import { computed } from '@angular/core';
import { ServicioCarrito } from '../../core/service/servicio-carrito/servicio-carrito';

@Component({
  imports: [UpperCasePipe],
  selector: 'app-candydetails',
  styleUrl: './candydetails.css',
  templateUrl: './candydetails.html',
})
export class Candydetails {
  id = input.required<string>();
  
  private candyservice = inject(Candyservice);
  private cartService = inject(ServicioCarrito);

  candy = computed(() => {
    const todosloscandys = this.candyservice.candy();
    return todosloscandys.find(c => c.id === this.id());
  });

  agregarAlCarrito() {
    const producto = this.candy();
    if (!producto) return;

    this.cartService.agregarAlCarrito({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen: producto.imagen,
      tipo: 'candy',
      cantidad: 1
    });

    alert(`¡${producto.nombre} agregado al carrito! 🍿`);
  }
}
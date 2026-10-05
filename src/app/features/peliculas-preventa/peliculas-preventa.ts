import { Component, inject, input } from '@angular/core';
import { Inject } from '@angular/core';
import { Injectable } from '@angular/core';
import { Movieservicie } from '../../core/service/movieservicie/movieservicie';
import { computed } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ServicioCarrito } from '../../core/service/servicio-carrito/servicio-carrito';
import { UpperCasePipe } from '@angular/common';
@Component({
  imports: [DatePipe,UpperCasePipe],
  selector: 'app-peliculas-preventa',
  styleUrl: './peliculas-preventa.css',
  templateUrl: './peliculas-preventa.html'
})
export class PeliculasPreventa {
 
  private moviesService = inject(Movieservicie);
  private cartService = inject(ServicioCarrito);

  // Filtramos todas las películas que están en preventa
  listapreventas = computed(() => {
    const todas = this.moviesService.peliculas();
    return todas.filter(p => p.es_preventa === true);
  });
  agregarPreventaAlCarrito(pelicula: any) {
    // Usamos el precio de preventa si existe, sino el precio normal
    const precioFinal = pelicula.precio_preventa ?? pelicula.precio;

    this.cartService.agregarAlCarrito({
      id: pelicula.id,
      nombre: `Preventa: ${pelicula.nombre}`,
      precio: precioFinal,
      imagen: pelicula.portada,
      tipo: 'preventa', // 👈 Identificador único para el carrito
      detalles: {
        fechaEstreno: pelicula.fecha_estreno,
        formato: pelicula.formato
      },
      cantidad: 1
    });

    alert(`¡Preventa de "${pelicula.nombre}" agregada al carrito! 🎟️`);
  }

}
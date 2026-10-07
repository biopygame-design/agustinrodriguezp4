import { Component, inject, signal, computed } from '@angular/core';
import { Candyservice } from '../../service/candyservice/candyservice';
import { Searchbar } from '../../shared/components/searchbar/searchbar';
import { Candycard } from '../../shared/components/candycard/candycard';
import { RouterOutlet } from '@angular/router';
import { ServicioCarrito } from '../../core/service/servicio-carrito/servicio-carrito';

@Component({
  imports: [RouterOutlet, Candycard, Searchbar],
  selector: 'app-home',
  styleUrl: './homec.css',
  templateUrl: './homec.html',
})
export class Homec {
  private candyservice = inject(Candyservice);
  private cartService = inject(ServicioCarrito); // 👈 2. Inyectalo acá

  candy = this.candyservice.candy;
  filtrobusqueda = signal("");

  candysfiltrados = computed(() => {
    const termino = this.filtrobusqueda().toLowerCase().trim();
    const lista = this.candy();

    console.log("Datos actuales en el componente Homec:", lista);

    if (!termino) {
      return lista;
    }
    return lista.filter(candy =>
      (candy.nombre ?? '').toLowerCase().includes(termino) || 
      (candy.id ?? '').toLowerCase().includes(termino)
    );
  });

  // 👈 3. Método para manejar la acción de agregar al carrito desde la card
  agregarAlCarrito(candy: any) {
    this.cartService.agregarAlCarrito({
      id: candy.id,
      nombre: candy.nombre,
      precio: candy.precio,
      imagen: candy.imagen,
      tipo: 'candy',
      cantidad: 1
    });
    alert(`¡${candy.nombre} agregado al carrito! 🍿`);
  }
}
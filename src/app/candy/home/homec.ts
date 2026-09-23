import { Component, inject, signal, computed } from '@angular/core';
import { Candyservice } from '../../service/candyservice/candyservice';
import { Searchbar } from '../../shared/components/searchbar/searchbar';
import { Candycard } from '../../shared/components/candycard/candycard';
import { RouterOutlet } from '@angular/router';

@Component({
  imports: [RouterOutlet, Candycard, Searchbar],
  selector: 'app-home',
  styleUrl: './homec.css',
  templateUrl: './homec.html',
})
export class Homec {
  private candyservice = inject(Candyservice);

  candy = this.candyservice.candy;

  filtrobusqueda = signal("");

  candysfiltrados = computed(() => {
    const termino = this.filtrobusqueda().toLowerCase().trim();
    const lista = this.candy();

    // 🔍 Aquí dentro del computed sí funciona correctamente el console.log
    console.log("Datos actuales en el componente Homec:", lista);

    if (!termino) {
      return lista;
    }
    return lista.filter(candy =>
      (candy.nombre ?? '').toLowerCase().includes(termino) || 
      (candy.id ?? '').toLowerCase().includes(termino)
    );
  });
}
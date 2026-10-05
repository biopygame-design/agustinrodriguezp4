import { Component, signal,computed,effect,inject } from '@angular/core';
import { movieinterface } from '../../../core/models/movieinterface/movieinterface';
import { Searchbar } from '../../../shared/components/searchbar/searchbar';
import { Movieservicie } from '../../../core/service/movieservicie/movieservicie';
import { Router,RouterOutlet } from '@angular/router';
import { Moviecard } from '../../../shared/components/moviecard/moviecard';
import { AuthService } from '../../../core/service/authservice/authservice';
import { TitleCasePipe } from '@angular/common';
@Component({
  imports: [Searchbar,RouterOutlet,Moviecard,TitleCasePipe],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home {
  private movieservicie = inject(Movieservicie);
  authservice = inject(AuthService);

  peliculas = this.movieservicie.peliculas;

  // Señales de filtrado
  filtrobusqueda = signal("");
  generoSeleccionado = signal("todos");

  // Lista de géneros para los botones (podés adaptarla a tus géneros reales)
  generosDisponibles = ['todos', 'Acción', 'Comedia', 'Terror', 'Drama'];

  // Computed que filtra tanto por texto como por género
  peliculasfiltradas = computed(() => {
    const termino = this.filtrobusqueda().toLowerCase().trim();
    const genero = this.generoSeleccionado();
    let lista = this.movieservicie.peliculas().filter(p => !p.es_preventa);;

    // 1. Filtrar por género si no es 'todos'
    if (genero !== 'todos') {
      lista = lista.filter(pelicula => 
        (pelicula.genero ?? '').toLowerCase() === genero.toLowerCase()
      );
    }

    // 2. Filtrar por término de búsqueda (si el usuario escribió algo)
    if (termino) {
      lista = lista.filter(pelicula =>
        (pelicula.nombre ?? '').toLowerCase().includes(termino) || 
        (pelicula.genero ?? '').toLowerCase().includes(termino)
      );
    }

    return lista;
  });

  // Método para cambiar el género al hacer clic en un botón
  cambiarGenero(genero: string) {
    this.generoSeleccionado.set(genero);
  }
}
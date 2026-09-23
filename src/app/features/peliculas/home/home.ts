import { Component, signal,computed,effect,inject } from '@angular/core';
import { movieinterface } from '../../../core/models/movieinterface/movieinterface';
import { Searchbar } from '../../../shared/components/searchbar/searchbar';
import { Movieservicie } from '../../../core/service/movieservicie/movieservicie';
import { Router,RouterOutlet } from '@angular/router';
import { Moviecard } from '../../../shared/components/moviecard/moviecard';
import { AuthService } from '../../../core/service/authservice/authservice';
@Component({
  imports: [Searchbar,RouterOutlet,Moviecard],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home {
  private movieservicie = inject(Movieservicie)
  authservice = inject(AuthService)


  peliculas = this.movieservicie.peliculas

  filtrobusqueda = signal("")

  peliculasfiltradas = computed(() =>{
    const termino = this.filtrobusqueda().toLowerCase().trim()
    if(!termino){
      return this.peliculas()
    }
    return this.peliculas().filter(pelicula =>
      (pelicula.nombre ?? '').toLowerCase().includes(termino) || 
      (pelicula.genero ?? '').toLowerCase().includes(termino)
    )
  })

  
}

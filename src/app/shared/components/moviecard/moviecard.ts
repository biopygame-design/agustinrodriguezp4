import { Component,input,output,inject } from '@angular/core';
import { movieinterface } from '../../../core/models/movieinterface/movieinterface';
import { Router } from '@angular/router';

@Component({
  imports: [],
  selector: 'app-moviecard',
  styleUrl: './moviecard.css',
  templateUrl: './moviecard.html',
})
export class Moviecard {
  pelicula = input.required<movieinterface>()
  private router = inject(Router)
  verDetalles() {
    this.router.navigate(['/pelicula', this.pelicula().id]);
  }

  comprarPelicula(peliculaId: string, horarioSeleccionado: string) {
    console.log('Película ID:', peliculaId, 'Horario:', horarioSeleccionado);
    
    // Navega a /butacas pasando el ID real y el horario elegido
    this.router.navigate(['/butacas'], { 
      queryParams: { 
        funcionId: peliculaId, 
        horario: horarioSeleccionado,
        precio: this.pelicula().precio
      } 
    });
  }
}

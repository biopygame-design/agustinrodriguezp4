import { Component,input,output,inject } from '@angular/core';
import { movieinterface } from '../../../core/models/movieinterface/movieinterface';
<<<<<<< HEAD
import { Router } from '@angular/router';
=======
>>>>>>> dd3b82963917c9df8e99f6fb50eddd8acc520040

@Component({
  imports: [],
  selector: 'app-moviecard',
  styleUrl: './moviecard.css',
  templateUrl: './moviecard.html',
})
export class Moviecard {
  pelicula = input.required<movieinterface>()
<<<<<<< HEAD
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
=======
>>>>>>> dd3b82963917c9df8e99f6fb50eddd8acc520040
}

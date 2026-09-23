import { Component, input, signal, inject, computed } from '@angular/core';
import { movieinterface } from '../../core/models/movieinterface/movieinterface';
import { Router } from '@angular/router';
import { Movieservicie } from '../../core/service/movieservicie/movieservicie';

@Component({
  imports: [], // Aquí puedes importar CommonModule si usas @for / @if nativos
  selector: 'app-moviedetails',
  styleUrl: './moviedetails.css',
  templateUrl: './moviedetails.html',
})
export class Moviedetails {
  id = input.required<string>();
  private movieservicie = inject(Movieservicie);
  private router = inject(Router);

  // Mantenemos tu computed para encontrar la película activa
  pelicula = computed(() => {
    const todaslaspeliculas = this.movieservicie.peliculas();
    return todaslaspeliculas.find(p => p.id === this.id());
  });

  // Signal para guardar el horario seleccionado por el usuario
  horarioSeleccionado = signal<string | null>(null);

  // Método para seleccionar un horario
  seleccionarHorario(horario: string) {
    this.horarioSeleccionado.set(horario);
  }

  // Método para continuar hacia la pantalla de butacas pasando el ID de la película y el horario
  continuarAAsientos() {
    const peliculaActual = this.pelicula();
    const horarioActual = this.horarioSeleccionado();

    if (peliculaActual && horarioActual) {
      // Navegas a la ruta de butacas enviando parámetros si lo deseas
      this.router.navigate(['/asientos', peliculaActual.id], { 
        queryParams: { horario: horarioActual } 
      });
    }
  }
}
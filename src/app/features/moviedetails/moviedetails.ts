import { Component, input, signal, inject, computed } from '@angular/core';
import { movieinterface } from '../../core/models/movieinterface/movieinterface';
import { Router } from '@angular/router';
import { Movieservicie } from '../../core/service/movieservicie/movieservicie';
import { Resenasservice } from '../../core/resenasservice/resenasservice';
import { AuthService } from '../../core/service/authservice/authservice';
import { Resenasmodelo } from '../../core/models/resenasmodelo/resenasmodelo';
import { effect } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormsModule,DatePipe], // Aquí puedes importar CommonModule si usas @for / @if nativos
  selector: 'app-moviedetails',
  styleUrl: './moviedetails.css',
  templateUrl: './moviedetails.html',
})
export class Moviedetails {
  id = input.required<string>();
  
  private movieservicie = inject(Movieservicie);
  private resenaService = inject(Resenasservice);
  public authService = inject(AuthService);
  private router = inject(Router);
  
  // Computada para encontrar la película activa
  pelicula = computed(() => {
    const todaslaspeliculas = this.movieservicie.peliculas();
    return todaslaspeliculas.find(p => p.id === this.id());
  });
  
  funcionesDisponibles = signal<any[]>([]);

  // Señal para guardar el objeto de la función seleccionada por el usuario
  horarioSeleccionado = signal<any | null>(null);
  
  // Estados para las reseñas y puntuación promedio
  resenas = signal<Resenasmodelo[]>([]);
  promedioEstrellas = signal<number>(0);
  totalResenas = signal<number>(0);

  // Formulario para nueva reseña
  nuevaEstrellas = signal<number>(5);
  nuevoComentario = signal<string>('');
  enviando = signal<boolean>(false);

  constructor() {
    // Usamos un effect para recargar las reseñas y funciones cada vez que cambie el ID de la película
    effect(async () => {
      const peliculaId = this.id();
      if (peliculaId) {
        await this.cargarResenas(peliculaId);
        await this.cargarFuncionesDePelicula(peliculaId);
      }
    });
  }

  async cargarFuncionesDePelicula(peliculaId: string | number) {
    const idLimpio = String(peliculaId).replace(/[\n\r%0A]/g, '').trim();
    const funciones = await this.movieservicie.obtenerFuncionesPorPelicula(idLimpio);
    this.funcionesDisponibles.set(funciones);
  }

  async cargarResenas(peliculaId: string | number) {
    const resultado = await this.resenaService.obtenerResenasDePelicula(peliculaId);
    this.resenas.set(resultado.resenas);
    this.promedioEstrellas.set(resultado.promedio);
    this.totalResenas.set(resultado.total);
  }

  // Método para seleccionar el objeto función completo
  seleccionarHorario(funcion: any) {
    this.horarioSeleccionado.set(funcion);
  }

  // Método para enviar una nueva reseña
  async enviarResena() {
    const comentarioActual = this.nuevoComentario().trim();
    if (!comentarioActual) return;

    try {
      this.enviando.set(true);
      await this.resenaService.agregarResena(
        this.id(),
        this.nuevaEstrellas(),
        comentarioActual
      );

      this.nuevoComentario.set('');
      this.nuevaEstrellas.set(5);
      await this.cargarResenas(this.id());
    } catch (error: any) {
      alert(error.message || 'Error al publicar la reseña');
    } finally {
      this.enviando.set(false);
    }
  }

  // Método para continuar hacia la pantalla de butacas usando el ID de la función
  continuarAAsientos() {
    const funcionActual = this.horarioSeleccionado();

    if (funcionActual) {
      this.router.navigate(['/butacas', funcionActual.id], { 
        queryParams: { horario: funcionActual.horario_inicio } 
      });
    }
  }
}
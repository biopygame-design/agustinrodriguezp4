import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/service/authservice/authservice';
import { ActivatedRoute, Router } from '@angular/router';
import { Movieservicie } from '../../core/service/movieservicie/movieservicie';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-modificarpelicula',
  styleUrl: './modificarpelicula.css',
  templateUrl: './modificarpelicula.html',
})
export class Modificarpelicula {
  private serviciopelicula = inject(Movieservicie);
  private router = inject(Router);
  private authService = inject(AuthService);

  // 🎬 Obtenemos la lista de películas reactivas desde el servicio
  listaPeliculas = this.serviciopelicula.peliculas;
  peliculaId: string | null = null;

  generos = ['Terror', 'Accion', 'Comedia', 'Documental', 'Ciencia Ficción', 'Fantasia', 'No-Ficcion'];
  formato = ['2D', '3D'];

  peliculasform = new FormGroup({
    nombre: new FormControl(""),
    duracion: new FormControl(""),
    genero: new FormControl(""),
    formato: new FormControl(""),
    idioma: new FormControl(""),
    subtitulos: new FormControl(""),
    portada: new FormControl(""),
    clasificacion: new FormControl(""),
    fecha_estreno: new FormControl(""),
    es_preventa: new FormControl(false),
    precio_preventa: new FormControl<number | null>(null)
  });

  get f() {
    return this.peliculasform.controls;
  }

  // 🔍 Se ejecuta cuando el usuario selecciona una película del desplegable
  onPeliculaSelect(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const id = selectElement.value;
    this.peliculaId = id;

    if (!id) {
      this.peliculasform.reset({ es_preventa: false });
      return;
    }

    // Buscamos la película elegida en la señal
    const peliculaEncontrada = this.listaPeliculas().find(p => p.id === id);

    if (peliculaEncontrada) {
      this.peliculasform.patchValue({
        nombre: peliculaEncontrada.nombre,
        duracion: peliculaEncontrada.duracion,
        genero: peliculaEncontrada.genero,
        formato: peliculaEncontrada.formato,
        idioma: peliculaEncontrada.idioma,
        subtitulos: peliculaEncontrada.subtitulos,
        portada: peliculaEncontrada.portada,
        clasificacion: peliculaEncontrada.clasificacion,
        fecha_estreno: peliculaEncontrada.fecha_estreno,
        es_preventa: peliculaEncontrada.es_preventa,
        precio_preventa: peliculaEncontrada.precio_preventa
      });
    }
  }

  // 📝 Valida que al menos un campo del formulario tenga texto escrito
  hayCamposCompletos(): boolean {
    const val = this.peliculasform.getRawValue();
    return !!(
      val.nombre ||
      val.duracion ||
      val.genero ||
      val.formato ||
      val.idioma ||
      val.subtitulos ||
      val.portada ||
      val.clasificacion ||
      val.fecha_estreno ||
      val.precio_preventa
    );
  }

  async onSubmit(): Promise<void> {
    if (!this.peliculaId) {
      alert('❌ Por favor, selecciona una película para modificar.');
      return;
    }

    if (!this.hayCamposCompletos()) {
      alert('❌ Debes completar al menos un campo para actualizar.');
      return;
    }

    const formValue = this.peliculasform.getRawValue();
    
    const exito = await this.serviciopelicula.actualizarPelicula(this.peliculaId, {
      nombre: formValue.nombre || '',
      duracion: formValue.duracion || '',
      genero: formValue.genero || '',
      formato: formValue.formato || '',
      idioma: formValue.idioma || '',
      subtitulos: formValue.subtitulos || '',
      portada: formValue.portada || '',
      clasificacion: formValue.clasificacion || '',
      fecha_estreno: formValue.fecha_estreno || '',
      es_preventa: formValue.es_preventa || false,
      precio_preventa: formValue.precio_preventa ?? 0,
    });

    if (exito) {
      alert(`✅ Película actualizada exitosamente!`);
      await this.authService.registrarLog(
        'exito',
        `Se actualizó exitosamente la película "${formValue.nombre}"`
      );
      this.router.navigate(['/inicio']);
    } else {
      alert('❌ Error al actualizar la película. Intenta nuevamente.');
    }
  }
}
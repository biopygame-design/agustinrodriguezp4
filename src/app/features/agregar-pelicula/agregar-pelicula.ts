import { Component,inject } from '@angular/core';
import { ReactiveFormsModule,FormGroup,FormControl,Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Movieservicie } from '../../core/service/movieservicie/movieservicie';
import { AuthService } from '../../core/service/authservice/authservice';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-agregar-pelicula',
  styleUrl: './agregar-pelicula.css',
  templateUrl: './agregar-pelicula.html',
})
export class AgregarPelicula {
  private serviciopelicula = inject(Movieservicie)
  private router = inject(Router)
  private authService = inject(AuthService)


  generos = ['Terror', 'Accion', 'Comedia', 'Documental', 'Ciencia Ficción', 'Fantasia', 'No-Ficcion'];
  formato = ['2D','3D']
  peliculasform = new FormGroup({
    nombre : new FormControl("",[
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(100)

    ]),
    duracion : new FormControl("",[
      Validators.required
    ]),
    genero : new FormControl("",[
      Validators.required
    ]),
    formato : new FormControl("",[
      Validators.required
    ]),
    idioma : new FormControl("",[
      Validators.required
    ]),
    subtitulos : new FormControl("",[
      Validators.required
    ]),
    portada : new FormControl("",[
      Validators.required
    ]),
    horarios : new FormControl("",[
      Validators.required
    ]),
    clasificacion : new FormControl("",[
      Validators.required
    ]),
    fecha_estreno : new FormControl("",[
      Validators.required
    ]),
    es_preventa: new FormControl(false,[
      Validators.required
    ]),
    precio_preventa : new FormControl(null,[
      Validators.required
    ])

  })
  get f(){
    return this.peliculasform.controls
  }
  async onSubmit(): Promise<void>{
    this.peliculasform.markAllAsTouched()

    if(this.peliculasform.invalid){
      return
    }
    const formValue = this.peliculasform.getRawValue();
    const exito = await this.serviciopelicula.agregarPelicula({
      
      nombre: formValue.nombre!,
      duracion : formValue.duracion!,
      genero : formValue.genero!,
      formato : formValue.formato!,
      idioma : formValue.idioma!,
      subtitulos : formValue.subtitulos!,
      portada : formValue.portada!,
      horarios: formValue.horarios ? formValue.horarios.split(',').map(h => h.trim()) : [],
      precio : 10.00,
      clasificacion : formValue.clasificacion!,
      fecha_estreno : formValue.fecha_estreno!,
      es_preventa : formValue.es_preventa!,
     precio_preventa : formValue.precio_preventa!,

    })
     if (exito) {
      // Navegamos al catálogo para ver la nueva pelicula
      alert(`✅ pelicula "${formValue.nombre}" agregado exitosamente!`);
      await this.authService.registrarLog(
  'exito',
  `Se creó exitosamente la película "${formValue.nombre}"`
);
  
      this.router.navigate(['/inicio']);
    } else {
      alert('❌ Error al agregar el pelicula. Intenta nuevamente.');
  }
}
}

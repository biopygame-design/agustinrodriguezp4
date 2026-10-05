import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Candyservice } from '../../service/candyservice/candyservice';
import { SupabaseService } from '../../core/service/supabaseservicie/supabaseservice';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-crear-candy',
  styleUrl: './crear-candy.css',
  templateUrl: './crear-candy.html',
})
export class CrearCandy {
  private candyService = inject(Candyservice);
  private router = inject(Router);
  private supabasesservice = inject(SupabaseService)

  categorias = ['Pochoclos', 'Bebidas', 'Golosinas', 'Combos'];

  candyForm = new FormGroup({
    nombre: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(100)
    ]),
    
    precio: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(0)
    ]),
    imagen: new FormControl('', [
      Validators.required
    ]),
    
  });

  get f() {
    return this.candyForm.controls;
  }

  async onSubmit(): Promise<void> {
    this.candyForm.markAllAsTouched();

    if (this.candyForm.invalid) {
      return;
    }

    const formValue = this.candyForm.getRawValue();
    
    const exito = await this.candyService.agregarCandy({
      nombre: formValue.nombre!,
     
      precio: formValue.precio!,
      imagen: formValue.imagen!,
     
    });

    if (exito) {
      alert(`✅ Producto "${formValue.nombre}" agregado al Candy Bar exitosamente!`);
      this.router.navigate(['/candy']); // Cambiá la ruta a donde listes el inventario del candy
    } else {
      alert('❌ Error al agregar el producto. Intenta nuevamente.');
    }
  }

}

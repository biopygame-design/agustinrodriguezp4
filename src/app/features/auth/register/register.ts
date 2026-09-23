import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/service/authservice/authservice';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-register',
  styleUrl: './register.css',
  templateUrl: './register.html',
})
export class Register {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    apellido: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    tipo_de_sangre: ['', [Validators.required, Validators.minLength(1)]],
    dias_de_vacaciones_al_anio: ['', [Validators.required]],
    color_de_ojos: ['', [Validators.required, Validators.minLength(3)]],
    rol: ['', [Validators.required]]
  });

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  async onSubmit() {
    if (this.registerForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    const { 
      nombre, 
      apellido, 
      email, 
      password, 
      tipo_de_sangre, 
      dias_de_vacaciones_al_anio, 
      color_de_ojos, 
      rol 
    } = this.registerForm.value;

    try {
      const { data, error } = await this.authService.signUp(
        email!, 
        password!, 
        nombre!, 
        apellido!, 
        tipo_de_sangre!, 
        dias_de_vacaciones_al_anio!, 
        color_de_ojos!, 
        rol!
      );

      if (error) throw error;

      if (data.user?.identities?.length === 0) {
        this.errorMessage.set('Este email ya está registrado.');
      } else if (data.user) {
        this.successMessage.set('¡Registro exitoso!');
        this.registerForm.reset();
        
        // Redirigir al inicio tras el registro exitoso
        this.router.navigate(['/inicio']);
      }
    } catch (error: any) {
      this.errorMessage.set(error.message || 'Error al registrarse');
    } finally {
      this.isLoading.set(false);
    }
  }
}
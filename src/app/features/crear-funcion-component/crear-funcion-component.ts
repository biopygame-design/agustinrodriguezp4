import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButacasService } from '../../service/butacas-service/butacas-service'; // Ajusta la ruta a tu servicio

@Component({
  selector: 'app-crear-funcion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-funcion-component.html',
  styleUrls: ['./crear-funcion-component.css']
})
export class CrearFuncionComponent {
 private butacasService = inject(ButacasService);
  private cdr = inject(ChangeDetectorRef); // <--- 2. Inyectar el detector de cambios

  peliculaId: string | null = null;
  salaId: number = 1;
  horarioInicio: string = '';
  horarioFin: string = '';
  cargando: boolean = false;
  mensajeResultado: string = '';

  listaPeliculas: any[] = [];

  ngOnInit() {
    this.cargarPeliculas();
  }

  async cargarPeliculas() {
    try {
      this.listaPeliculas = await this.butacasService.obtenerPeliculas();
    } catch (error) {
      console.error('Error al cargar las películas:', error);
    }
  }

  async programarFuncion() {
    if (!this.peliculaId) {
      alert('Por favor selecciona una película.');
      return;
    }

    this.cargando = true;
    this.mensajeResultado = '';
    this.cdr.detectChanges(); // <--- Forzar que la UI muestre el estado "cargando" al iniciar

    try {
      const resultado = await this.butacasService.crearFuncionYGenerarButacas(
        Number(this.peliculaId),
        Number(this.salaId),
        this.horarioInicio,
        this.horarioFin
      );

      this.mensajeResultado = resultado.mensaje;
      alert(resultado.mensaje);

      if (resultado.exito) {
        this.horarioInicio = '';
        this.horarioFin = '';
        this.peliculaId = null;
      }
    } catch (error) {
      console.error('Error:', error);
      this.mensajeResultado = 'Ocurrió un error inesperado.';
      alert('Ocurrió un error inesperado.');
    } finally {
      // 3. Desactivar carga y obligar a Angular a refrescar la vista del botón inmediatamente
      this.cargando = false;
      this.cdr.detectChanges(); 
    }
  }
}
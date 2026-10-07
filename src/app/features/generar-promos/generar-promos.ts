import { Component, inject } from '@angular/core';
import { Promomodelo } from '../../core/models/promomodelo/promomodelo';
import { Promosservicio } from '../../core/service/promosservicio/promosservicio';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
<<<<<<< HEAD
import { AuthService } from '../../core/service/authservice/authservice';
=======
>>>>>>> dd3b82963917c9df8e99f6fb50eddd8acc520040

@Component({
  imports: [FormsModule,CommonModule],
  selector: 'app-generar-promos',
  styleUrl: './generar-promos.css',
  templateUrl: './generar-promos.html',
})
export class GenerarPromos {
  private promosService = inject(Promosservicio);
<<<<<<< HEAD
  private authService = inject(AuthService)
=======

>>>>>>> dd3b82963917c9df8e99f6fb50eddd8acc520040
  nuevaPromo: Promomodelo = {
    titulo: '',
    descripcion: '',
    tipo: 'puntos',
    puntos_necesarios: 100,
    edad_minima: 0,
    edad_maxima: 99,
    descuento_porcentaje: 0,
    activo: true
  };

  async guardarPromo() {
    const resultado = await this.promosService.crearPromo(this.nuevaPromo);
    if (resultado.exito) {
      alert('¡Promo creada con éxito en la base de datos!');
<<<<<<< HEAD
      await this.authService.registrarLog(
    'Modificación de Película', 
    'Se actualizó el precio de la película Batman'
  );
=======
>>>>>>> dd3b82963917c9df8e99f6fb50eddd8acc520040
      // Limpiar formulario...
    } else {
      alert('Error al crear la promo.');
    }
  }

}

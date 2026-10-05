import { Component, inject } from '@angular/core';
import { Promomodelo } from '../../core/models/promomodelo/promomodelo';
import { Promosservicio } from '../../core/service/promosservicio/promosservicio';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  imports: [FormsModule,CommonModule],
  selector: 'app-generar-promos',
  styleUrl: './generar-promos.css',
  templateUrl: './generar-promos.html',
})
export class GenerarPromos {
  private promosService = inject(Promosservicio);

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
      // Limpiar formulario...
    } else {
      alert('Error al crear la promo.');
    }
  }

}

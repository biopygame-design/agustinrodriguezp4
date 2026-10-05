import { Component } from '@angular/core';
import {  inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButacasService } from '../../service/butacas-service/butacas-service';

@Component({
  imports: [FormsModule,CommonModule],
  selector: 'app-validar-entrada',
  styleUrl: './validar-entrada.css',
  templateUrl: './validar-entrada.html',
})
export class ValidarEntrada {
  butacasService = inject(ButacasService);

  codigoIngresado: string = '';
  mensajeResultado: string = '';
  esExito: boolean = false;

  async validar() {
    if (!this.codigoIngresado.trim()) return;

    // Llamamos al método del servicio
    const respuesta = await this.butacasService.validarEntradaPorCodigo(this.codigoIngresado);

    this.esExito = respuesta.exito;
    this.mensajeResultado = respuesta.mensaje;

    // Si fue exitoso, limpiamos el input para el siguiente código
    if (respuesta.exito) {
      this.codigoIngresado = '';
    }
  }


}

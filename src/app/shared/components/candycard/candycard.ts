import { Component,input,output,inject } from '@angular/core';
import { candyinterface } from '../../../core/models/candyinterface/candyinterface';
import { UpperCasePipe } from '@angular/common';

@Component({
  imports: [UpperCasePipe],
  selector: 'app-candycard',
  styleUrl: './candycard.css',
  templateUrl: './candycard.html',
})
export class Candycard {
  candy = input.required<candyinterface>();
  
  // 🟢 Creamos un output para emitir el evento al componente padre
  agregarAlCarrito = output<candyinterface>();

  onAgregar() {
    this.agregarAlCarrito.emit(this.candy());
  }
}

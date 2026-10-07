import { Component,input,output,inject } from '@angular/core';
import { candyinterface } from '../../../core/models/candyinterface/candyinterface';
<<<<<<< HEAD
import { UpperCasePipe } from '@angular/common';

@Component({
  imports: [UpperCasePipe],
=======

@Component({
  imports: [],
>>>>>>> dd3b82963917c9df8e99f6fb50eddd8acc520040
  selector: 'app-candycard',
  styleUrl: './candycard.css',
  templateUrl: './candycard.html',
})
export class Candycard {
<<<<<<< HEAD
  candy = input.required<candyinterface>();
  
  // 🟢 Creamos un output para emitir el evento al componente padre
  agregarAlCarrito = output<candyinterface>();

  onAgregar() {
    this.agregarAlCarrito.emit(this.candy());
  }
}
=======
  candy =  input.required<candyinterface>()
}
>>>>>>> dd3b82963917c9df8e99f6fb50eddd8acc520040

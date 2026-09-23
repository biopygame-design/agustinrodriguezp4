import { Component,input,output,inject } from '@angular/core';
import { candyinterface } from '../../../core/models/candyinterface/candyinterface';

@Component({
  imports: [],
  selector: 'app-candycard',
  styleUrl: './candycard.css',
  templateUrl: './candycard.html',
})
export class Candycard {
  candy =  input.required<candyinterface>()
}

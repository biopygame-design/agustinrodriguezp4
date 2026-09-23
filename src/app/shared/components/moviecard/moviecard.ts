import { Component,input,output,inject } from '@angular/core';
import { movieinterface } from '../../../core/models/movieinterface/movieinterface';

@Component({
  imports: [],
  selector: 'app-moviecard',
  styleUrl: './moviecard.css',
  templateUrl: './moviecard.html',
})
export class Moviecard {
  pelicula = input.required<movieinterface>()
}

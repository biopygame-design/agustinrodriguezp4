import { Component,model } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-searchbar',
  styleUrl: './searchbar.css',
  templateUrl: './searchbar.html',
})
export class Searchbar {
  termino = model<string>('');

  limpiar(): void {
    this.termino.set('');
  }
}

import { Component, input, signal, effect, inject } from '@angular/core';
import { Candyservice } from '../../service/candyservice/candyservice';
import { Router } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { candyinterface } from '../../core/models/candyinterface/candyinterface';

import { computed } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-candydetails',
  styleUrl: './candydetails.css',
  templateUrl: './candydetails.html',
})
export class Candydetails {
  id = input.required<string>();
 private candyservice = inject(Candyservice)

 candy = computed(()=>{
  const todosloscandys = this.candyservice.candy()
  return todosloscandys.find(c => c.id === this.id())

 })
}

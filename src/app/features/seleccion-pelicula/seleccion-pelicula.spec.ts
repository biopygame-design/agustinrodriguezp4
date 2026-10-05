import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SeleccionPelicula } from './seleccion-pelicula';

describe('SeleccionPelicula', () => {
  let component: SeleccionPelicula;
  let fixture: ComponentFixture<SeleccionPelicula>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeleccionPelicula],
    }).compileComponents();

    fixture = TestBed.createComponent(SeleccionPelicula);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

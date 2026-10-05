import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgregarPelicula } from './agregar-pelicula';

describe('AgregarPelicula', () => {
  let component: AgregarPelicula;
  let fixture: ComponentFixture<AgregarPelicula>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgregarPelicula],
    }).compileComponents();

    fixture = TestBed.createComponent(AgregarPelicula);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

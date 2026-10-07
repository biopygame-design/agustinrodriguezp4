import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Modificarpelicula } from './modificarpelicula';

describe('Modificarpelicula', () => {
  let component: Modificarpelicula;
  let fixture: ComponentFixture<Modificarpelicula>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Modificarpelicula],
    }).compileComponents();

    fixture = TestBed.createComponent(Modificarpelicula);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

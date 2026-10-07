import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarritoModelo } from './carrito-modelo';

describe('CarritoModelo', () => {
  let component: CarritoModelo;
  let fixture: ComponentFixture<CarritoModelo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarritoModelo],
    }).compileComponents();

    fixture = TestBed.createComponent(CarritoModelo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

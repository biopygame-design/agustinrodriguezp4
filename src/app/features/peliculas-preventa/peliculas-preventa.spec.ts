import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PeliculasPreventa } from './peliculas-preventa';

describe('PeliculasPreventa', () => {
  let component: PeliculasPreventa;
  let fixture: ComponentFixture<PeliculasPreventa>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeliculasPreventa],
    }).compileComponents();

    fixture = TestBed.createComponent(PeliculasPreventa);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

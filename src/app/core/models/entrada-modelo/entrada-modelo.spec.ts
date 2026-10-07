import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EntradaModelo } from './entrada-modelo';

describe('EntradaModelo', () => {
  let component: EntradaModelo;
  let fixture: ComponentFixture<EntradaModelo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntradaModelo],
    }).compileComponents();

    fixture = TestBed.createComponent(EntradaModelo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EntradasServicio } from './entradas-servicio';

describe('EntradasServicio', () => {
  let component: EntradasServicio;
  let fixture: ComponentFixture<EntradasServicio>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntradasServicio],
    }).compileComponents();

    fixture = TestBed.createComponent(EntradasServicio);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

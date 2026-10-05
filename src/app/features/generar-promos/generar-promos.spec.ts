import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GenerarPromos } from './generar-promos';

describe('GenerarPromos', () => {
  let component: GenerarPromos;
  let fixture: ComponentFixture<GenerarPromos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenerarPromos],
    }).compileComponents();

    fixture = TestBed.createComponent(GenerarPromos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

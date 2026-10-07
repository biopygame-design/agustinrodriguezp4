import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Empleadoguard } from './empleadoguard';

describe('Empleadoguard', () => {
  let component: Empleadoguard;
  let fixture: ComponentFixture<Empleadoguard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Empleadoguard],
    }).compileComponents();

    fixture = TestBed.createComponent(Empleadoguard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

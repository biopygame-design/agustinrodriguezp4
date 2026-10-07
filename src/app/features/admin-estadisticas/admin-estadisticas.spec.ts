import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminEstadisticas } from './admin-estadisticas';

describe('AdminEstadisticas', () => {
  let component: AdminEstadisticas;
  let fixture: ComponentFixture<AdminEstadisticas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminEstadisticas],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminEstadisticas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Promosservicio } from './promosservicio';

describe('Promosservicio', () => {
  let component: Promosservicio;
  let fixture: ComponentFixture<Promosservicio>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Promosservicio],
    }).compileComponents();

    fixture = TestBed.createComponent(Promosservicio);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

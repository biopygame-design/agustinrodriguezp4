import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButacasService } from './butacas-service';

describe('ButacasService', () => {
  let component: ButacasService;
  let fixture: ComponentFixture<ButacasService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButacasService],
    }).compileComponents();

    fixture = TestBed.createComponent(ButacasService);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

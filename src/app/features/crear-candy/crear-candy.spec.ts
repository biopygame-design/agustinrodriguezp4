import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrearCandy } from './crear-candy';

describe('CrearCandy', () => {
  let component: CrearCandy;
  let fixture: ComponentFixture<CrearCandy>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearCandy],
    }).compileComponents();

    fixture = TestBed.createComponent(CrearCandy);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

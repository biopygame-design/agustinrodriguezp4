import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Movieinterface } from './movieinterface';

describe('Movieinterface', () => {
  let component: Movieinterface;
  let fixture: ComponentFixture<Movieinterface>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Movieinterface],
    }).compileComponents();

    fixture = TestBed.createComponent(Movieinterface);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

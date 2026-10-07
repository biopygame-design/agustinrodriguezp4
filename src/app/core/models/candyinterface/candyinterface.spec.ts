import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Candyinterface } from './candyinterface';

describe('Candyinterface', () => {
  let component: Candyinterface;
  let fixture: ComponentFixture<Candyinterface>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Candyinterface],
    }).compileComponents();

    fixture = TestBed.createComponent(Candyinterface);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

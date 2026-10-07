import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Candycard } from './candycard';

describe('Candycard', () => {
  let component: Candycard;
  let fixture: ComponentFixture<Candycard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Candycard],
    }).compileComponents();

    fixture = TestBed.createComponent(Candycard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

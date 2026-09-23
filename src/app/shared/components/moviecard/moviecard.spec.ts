import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Moviecard } from './moviecard';

describe('Moviecard', () => {
  let component: Moviecard;
  let fixture: ComponentFixture<Moviecard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Moviecard],
    }).compileComponents();

    fixture = TestBed.createComponent(Moviecard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

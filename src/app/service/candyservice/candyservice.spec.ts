import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Candyservice } from './candyservice';

describe('Candyservice', () => {
  let component: Candyservice;
  let fixture: ComponentFixture<Candyservice>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Candyservice],
    }).compileComponents();

    fixture = TestBed.createComponent(Candyservice);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

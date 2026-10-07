import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Candydetails } from './candydetails';

describe('Candydetails', () => {
  let component: Candydetails;
  let fixture: ComponentFixture<Candydetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Candydetails],
    }).compileComponents();

    fixture = TestBed.createComponent(Candydetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

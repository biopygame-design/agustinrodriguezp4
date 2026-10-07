import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Moviedetails } from './moviedetails';

describe('Moviedetails', () => {
  let component: Moviedetails;
  let fixture: ComponentFixture<Moviedetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Moviedetails],
    }).compileComponents();

    fixture = TestBed.createComponent(Moviedetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

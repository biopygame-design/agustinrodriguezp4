import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Butacamodelo } from './butacamodelo';

describe('Butacamodelo', () => {
  let component: Butacamodelo;
  let fixture: ComponentFixture<Butacamodelo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Butacamodelo],
    }).compileComponents();

    fixture = TestBed.createComponent(Butacamodelo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

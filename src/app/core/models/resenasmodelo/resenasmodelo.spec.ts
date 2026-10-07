import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Resenasmodelo } from './resenasmodelo';

describe('Resenasmodelo', () => {
  let component: Resenasmodelo;
  let fixture: ComponentFixture<Resenasmodelo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Resenasmodelo],
    }).compileComponents();

    fixture = TestBed.createComponent(Resenasmodelo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

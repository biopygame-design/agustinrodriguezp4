import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Userinterface } from './userinterface';

describe('Userinterface', () => {
  let component: Userinterface;
  let fixture: ComponentFixture<Userinterface>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Userinterface],
    }).compileComponents();

    fixture = TestBed.createComponent(Userinterface);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Resenasservice } from './resenasservice';

describe('Resenasservice', () => {
  let component: Resenasservice;
  let fixture: ComponentFixture<Resenasservice>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Resenasservice],
    }).compileComponents();

    fixture = TestBed.createComponent(Resenasservice);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Adminlogs } from './adminlogs';

describe('Adminlogs', () => {
  let component: Adminlogs;
  let fixture: ComponentFixture<Adminlogs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Adminlogs],
    }).compileComponents();

    fixture = TestBed.createComponent(Adminlogs);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

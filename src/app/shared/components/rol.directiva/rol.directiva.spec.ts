import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RolDirectiva } from './rol.directiva';

describe('RolDirectiva', () => {
  let component: RolDirectiva;
  let fixture: ComponentFixture<RolDirectiva>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RolDirectiva],
    }).compileComponents();

    fixture = TestBed.createComponent(RolDirectiva);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

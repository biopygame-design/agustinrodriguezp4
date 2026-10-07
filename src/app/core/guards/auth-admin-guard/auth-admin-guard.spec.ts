import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthAdminGuard } from './auth-admin-guard';

describe('AuthAdminGuard', () => {
  let component: AuthAdminGuard;
  let fixture: ComponentFixture<AuthAdminGuard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthAdminGuard],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthAdminGuard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

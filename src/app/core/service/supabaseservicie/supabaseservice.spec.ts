import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Supabaseservicie } from './supabaseservicie';

describe('Supabaseservicie', () => {
  let component: Supabaseservicie;
  let fixture: ComponentFixture<Supabaseservicie>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Supabaseservicie],
    }).compileComponents();

    fixture = TestBed.createComponent(Supabaseservicie);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

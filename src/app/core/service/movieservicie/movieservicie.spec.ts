import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Movieservicie } from './movieservicie';

describe('Movieservicie', () => {
  let component: Movieservicie;
  let fixture: ComponentFixture<Movieservicie>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Movieservicie],
    }).compileComponents();

    fixture = TestBed.createComponent(Movieservicie);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

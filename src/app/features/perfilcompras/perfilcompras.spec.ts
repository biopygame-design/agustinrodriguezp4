import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Perfilcompras } from './perfilcompras';

describe('Perfilcompras', () => {
  let component: Perfilcompras;
  let fixture: ComponentFixture<Perfilcompras>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Perfilcompras],
    }).compileComponents();

    fixture = TestBed.createComponent(Perfilcompras);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

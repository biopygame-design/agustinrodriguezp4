import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Promomodelo } from './promomodelo';

describe('Promomodelo', () => {
  let component: Promomodelo;
  let fixture: ComponentFixture<Promomodelo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Promomodelo],
    }).compileComponents();

    fixture = TestBed.createComponent(Promomodelo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

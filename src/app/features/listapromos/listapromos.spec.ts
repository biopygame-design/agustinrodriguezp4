import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Listapromos } from './listapromos';

describe('Listapromos', () => {
  let component: Listapromos;
  let fixture: ComponentFixture<Listapromos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Listapromos],
    }).compileComponents();

    fixture = TestBed.createComponent(Listapromos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

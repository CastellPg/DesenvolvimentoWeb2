import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceitasCategorias } from './receitas-categorias';

describe('ReceitasCategorias', () => {
  let component: ReceitasCategorias;
  let fixture: ComponentFixture<ReceitasCategorias>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReceitasCategorias],
    }).compileComponents();

    fixture = TestBed.createComponent(ReceitasCategorias);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

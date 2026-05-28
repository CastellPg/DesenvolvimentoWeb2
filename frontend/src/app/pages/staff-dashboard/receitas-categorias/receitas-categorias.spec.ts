import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceitasCategoriaComponent } from './receitas-categorias';

describe('ReceitasCategoriaComponent', () => {
  let component: ReceitasCategoriaComponent;
  let fixture: ComponentFixture<ReceitasCategoriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReceitasCategoriaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReceitasCategoriaComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

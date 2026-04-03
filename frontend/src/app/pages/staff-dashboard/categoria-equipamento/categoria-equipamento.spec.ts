import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriaEquipamentoComponent } from './categoria-equipamento';

describe('CategoriaEquipamentoComponent', () => {
  let component: CategoriaEquipamentoComponent;
  let fixture: ComponentFixture<CategoriaEquipamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriaEquipamentoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoriaEquipamentoComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

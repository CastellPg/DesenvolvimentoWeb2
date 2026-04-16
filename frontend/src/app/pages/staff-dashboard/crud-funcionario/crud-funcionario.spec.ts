import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudFuncionarioComponent } from './crud-funcionario';

describe('CrudFuncionario', () => {
  let component: CrudFuncionarioComponent;
  let fixture: ComponentFixture<CrudFuncionarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrudFuncionarioComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CrudFuncionarioComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

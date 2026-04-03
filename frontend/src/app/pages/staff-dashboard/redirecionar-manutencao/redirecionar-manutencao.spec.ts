import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedirecionarManutencaoComponent } from './redirecionar-manutencao';

describe('RedirecionarManutencao', () => {
  let component: RedirecionarManutencaoComponent;
  let fixture: ComponentFixture<RedirecionarManutencaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RedirecionarManutencaoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RedirecionarManutencaoComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinhasSolicitacoes } from './minhas-solicitacoes';

describe('MinhasSolicitacoes', () => {
  let component: MinhasSolicitacoes;
  let fixture: ComponentFixture<MinhasSolicitacoes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MinhasSolicitacoes],
    }).compileComponents();

    fixture = TestBed.createComponent(MinhasSolicitacoes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

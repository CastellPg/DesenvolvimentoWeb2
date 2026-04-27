import { ComponentFixture, TestBed } from '@angular/core/testing';

import {NovaSolicitacaoComponent } from './nova-solicitacao';

describe('NovaSolicitacao', () => {
  let component: NovaSolicitacaoComponent;
  let fixture: ComponentFixture<NovaSolicitacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NovaSolicitacaoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NovaSolicitacaoComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

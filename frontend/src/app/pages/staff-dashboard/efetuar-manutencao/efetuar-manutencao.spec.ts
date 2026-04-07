import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EfetuarManutencaoComponent } from './efetuar-manutencao';

describe('EfetuarManutencao', () => {
  let component: EfetuarManutencaoComponent;
  let fixture: ComponentFixture<EfetuarManutencaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EfetuarManutencaoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EfetuarManutencaoComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

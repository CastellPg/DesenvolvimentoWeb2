import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrcamentoComponent } from './orcamento';

describe('Orcamento', () => {
  let component: OrcamentoComponent;
  let fixture: ComponentFixture<OrcamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrcamentoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OrcamentoComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

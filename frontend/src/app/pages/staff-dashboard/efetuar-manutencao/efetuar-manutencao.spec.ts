import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { EfetuarManutencaoComponent } from './efetuar-manutencao';

describe('EfetuarManutencao', () => {
  let component: EfetuarManutencaoComponent;
  let fixture: ComponentFixture<EfetuarManutencaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EfetuarManutencaoComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(EfetuarManutencaoComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

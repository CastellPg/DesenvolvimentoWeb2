import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaPedidoComponent } from './lista-pedido';

describe('ListaPedidoComponent', () => {
  let component: ListaPedidoComponent;
  let fixture: ComponentFixture<ListaPedidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaPedidoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ListaPedidoComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

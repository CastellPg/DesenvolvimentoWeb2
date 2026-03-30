import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

declare var bootstrap: any;

@Component({
  selector: 'app-efetuar-orcamento',
  imports: [CommonModule, ReactiveFormsModule, RouterLink ],
  templateUrl: './efetuar-orcamento.html',
  styleUrl: './efetuar-orcamento.css',
})
export class EfetuarOrcamentoComponent implements OnInit {

  solicitacao: any;
  formOrcamento!: FormGroup;

  tecnicoLogado: string = 'Carlos Técnico';
  dataRegistro: string = '30/03/2026, 08:34:05';

  dataHoraAtual: string = '30/03/2026, 08:34:05';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
  ){}

  ngOnInit(): void{

    const idUrl = this.route.snapshot.paramMap.get('id');

    this.formOrcamento = this.fb.group({
      valor: ['',[Validators.required, Validators.min(0.01)]]
    });

    //Simulando a busca, depois vai ser pelo BD

    this.carregarDadosSimulados(idUrl);

  }

  carregarDadosSimulados(id :string | null){

    const listaCompleta = [
    { 
      id: '1', status: 'ABERTA', dataAbertura: '23/03/2026, 09:30', produto: 'Dell Inspiron 15 3000', problema: 'Notebook não liga, led piscando',
      cliente: { nome: 'João Silva', email: 'joao@email.com', cpf: '123.456.789-00', telefone: '(41) 98765-4321', endereco: 'Rua das Flores, 100 - Curitiba, PR' }
    },
    { 
      id: '2', status: 'ABERTA', dataAbertura: '23/03/2026, 10:45', produto: 'PlayStation 5 - Edição Digital', problema: 'Barulho excessivo no cooler ao iniciar jogos',
      cliente: { nome: 'Carlos Alberto', email: 'carlos@email.com', cpf: '222.333.444-55', telefone: '(41) 99988-7766', endereco: 'Av. Sete de Setembro, 500 - Curitiba, PR' }
    },
    { 
      id: '3', status: 'ABERTA', dataAbertura: '22/03/2026, 11:00', produto: 'Placa Mãe Asus B450 Gaming', problema: 'Não reconhece memória no slot 2',
      cliente: { nome: 'Lucas Lima', email: 'lucas@email.com', cpf: '999.888.777-11', telefone: '(41) 91122-3344', endereco: 'Rua XV de Novembro, 20 - Curitiba, PR' }
    }
  ];

  const clienteEncontrado = listaCompleta.find(item => item.id === id);
  this.solicitacao = clienteEncontrado || listaCompleta[0];
}


  confirmarOrcamento() {
    if(this.formOrcamento.valid){
      const valorGerado = this.formOrcamento.value.valor;

      console.log(`Salvando Orçamento para os ${this.solicitacao.id}`);
      console.log(`Valor R$ %{valorGerado}`);

      //Aqui vai a lógica do back dps

      this.mostrarAviso('Orçamento confirmado com sucesso! ');

      setTimeout(() =>{
        this.router.navigate(['/staff']);
      }, 2000);

  
    }
  }

   mostrarAviso(mensagem: string){

      const spanTexto = document.getElementById('textoAviso');
      if (spanTexto){
        spanTexto.innerText = mensagem;
      }
        const elementoAviso = document.getElementById('avisoSucesso');
        if(elementoAviso) {
          const exibirAviso = new bootstrap.Toast(elementoAviso);
          exibirAviso.show();
        }
    }

}

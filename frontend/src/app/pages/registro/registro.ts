import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ViewChild, ElementRef, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, NgxMaskDirective],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class RegistroComponent {
  @ViewChild('inputNumero') campoNumero!: ElementRef;

  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  constructor(private http: HttpClient) {}

  mensagemErro: string = '';
  mensagemSucesso: string = '';

  public endereco = {
    cep: '',
    logradouro: '',
    cidade: '',
    bairro: '',
    estado: '',
    numero: '',
    complemento: '',
  };

  public dados = {
    cpf: '',
    nomeCompleto: '',
    email: '',
    telefone: ''
  };

  buscarCep() {
    if (!this.endereco.cep) return;

    const cepLimpo = this.endereco.cep.replace(/\D/g, '');

    if (cepLimpo.length === 8) {
      this.http.get(`https://viacep.com.br/ws/${cepLimpo}/json/`)
        .subscribe({
          next: (dados: any) => {
            console.log(dados);

            if (dados.erro) {
              this.mensagemErro = 'CEP não encontrado.';
              this.cdr.detectChanges();
              return;
            }

            this.mensagemErro = '';
            this.endereco.logradouro = dados.logradouro;
            this.endereco.bairro = dados.bairro;
            this.endereco.cidade = dados.localidade;
            this.endereco.estado = dados.uf;

            this.cdr.detectChanges();

            setTimeout(() => {
              this.campoNumero?.nativeElement.focus();
            }, 50);
          },
          error: () => {
            this.mensagemErro = 'Não foi possível buscar o CEP.';
            this.cdr.detectChanges();
          }
        });
    }
  }


  registrar() {
    this.mensagemErro = '';
    this.mensagemSucesso = '';
    this.cdr.detectChanges();

     const telefoneLimpo = this.dados.telefone.replace(/\D/g, '');

     const telefoneFormatado = telefoneLimpo.replace(
     /^(\d{2})(\d{4,5})(\d{4})$/,
     '($1) $2-$3'
   );

    const dados_registrar = {
      cpf: this.dados.cpf,
      email: this.dados.email,
      nome: this.dados.nomeCompleto,
      telefone: telefoneFormatado ,
      cep: this.endereco.cep,
      logradouro: this.endereco.logradouro,
      numero: this.endereco.numero,
      complemento: this.endereco.complemento,
      bairro: this.endereco.bairro,
      cidade: this.endereco.cidade,
      estado: this.endereco.estado
    };

    this.http.post(
      'http://localhost:8080/clientes/cadastro',
      dados_registrar,
      { responseType: 'text', withCredentials: true }
    ).subscribe({
      next: () => {
        this.mensagemErro = '';
        this.mensagemSucesso = 'Cadastro realizado com sucesso! Verifique seu e-mail.';
        this.cdr.detectChanges();

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },
      error: (err) => {
        console.error('Erro no cadastro:', err);
        console.log('err.error =>', err.error);
        console.log('status =>', err.status);

        this.mensagemSucesso = '';

        if (typeof err.error === 'string') {
          try {
            this.mensagemErro = JSON.parse(err.error).messages?.[0] || 'Erro ao cadastrar.';
          } catch {
            this.mensagemErro = err.error || 'Erro ao cadastrar.';
          }
        } else {
          this.mensagemErro = err.error?.messages?.[0] || 'Erro ao cadastrar.';
        }

        this.cdr.detectChanges();
      }
    });
  }
}
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SolicitacaoService, SolicitacaoResponse, RegistrarManutencaoRequest } from '../../../services/solicitacao.service';

@Component({
  selector: 'app-efetuar-manutencao',
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './efetuar-manutencao.html',
  styleUrl: './efetuar-manutencao.css',
})
export class EfetuarManutencaoComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private solicitacaoService = inject(SolicitacaoService);

  solicitacao: SolicitacaoResponse | null = null;
  formManutencao!: FormGroup;

  nomeUsuario = localStorage.getItem('nomeUsuario') ?? 'Técnico';
  funcionarioId = Number(localStorage.getItem('usuarioId'));

  carregando = false;
  enviando = false;
  mensagemErro: string | null = null;
  mensagemSucesso: string | null = null;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    this.formManutencao = this.fb.group({
      descricaoManutencao: ['', Validators.required],
      orientacoesCliente: ['', Validators.required],
      pecasUsadas: [''],
      tempoGasto: [null, [Validators.min(1), Validators.pattern('^[0-9]*$')]]
    });

    if (id) {
      this.carregando = true;
      this.solicitacaoService.buscarPorId(id).subscribe({
        next: (data) => {
          this.solicitacao = data;
          this.carregando = false;
        },
        error: () => {
          this.mensagemErro = 'Erro ao carregar os dados da solicitação.';
          this.carregando = false;
        }
      });
    }
  }

  confirmarManutencao(): void {
    if (this.formManutencao.invalid || !this.solicitacao) return;

    const { descricaoManutencao, orientacoesCliente, pecasUsadas, tempoGasto } = this.formManutencao.value;

    const request: RegistrarManutencaoRequest = {
      descricaoManutencao,
      orientacoesCliente,
      pecasUsadas: pecasUsadas || undefined,
      tempoGasto: tempoGasto ? Number(tempoGasto) : undefined
    };

    this.enviando = true;
    this.mensagemErro = null;

    this.solicitacaoService.registrarManutencao(this.solicitacao.id, request, this.funcionarioId).subscribe({
      next: () => {
        this.mensagemSucesso = 'Manutenção registrada com sucesso!';
        this.enviando = false;
        setTimeout(() => this.router.navigate(['/solicitacoes']), 1800);
      },
      error: (err) => {
        const msgs: string[] = err?.error?.messages;
        this.mensagemErro = msgs?.length ? msgs.join(' ') : 'Erro ao registrar manutenção. Tente novamente.';
        this.enviando = false;
      }
    });
  }
}

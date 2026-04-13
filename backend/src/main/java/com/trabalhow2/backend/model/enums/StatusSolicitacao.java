package com.trabalhow2.backend.model.enums;

public enum StatusSolicitacao {
    ABERTA,         // Cinza   — aguardando triagem
    ORCADA,         // Marrom  — orçamento realizado pelo funcionário
    APROVADA,       // Amarelo — orçamento aprovado pelo cliente
    REJEITADA,      // Vermelho — orçamento rejeitado pelo cliente
    REDIRECIONADA,  // Roxo   — chamado redirecionado para outro técnico
    ARRUMADA,       // Azul   — manutenção concluída
    PAGA,           // Alaranjado — pagamento confirmado
    FINALIZADA      // Verde  — ordem de serviço encerrada
}

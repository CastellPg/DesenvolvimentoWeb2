package com.trabalhow2.backend.utils;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

public class SeederFicticio {

    private static final String[] NOMES = {
        "João", "Maria", "Carlos", "Ana", "Lucas", "Fernanda",
        "Rafael", "Juliana", "Pedro", "Camila"
    };

    private static final String[] CIDADES = {
        "Curitiba", "São Paulo", "Rio de Janeiro", "Belo Horizonte",
        "Porto Alegre", "Florianópolis"
    };

    private static final String[] STATUS = {
        "ABERTA", "EM_ANDAMENTO", "FINALIZADA", "CANCELADA"
    };

    private final Random random = new Random();

    public List<String> gerarClientesFicticios(int quantidade) {
        List<String> clientes = new ArrayList<>();

        for (int i = 0; i < quantidade; i++) {
            String nome = NOMES[random.nextInt(NOMES.length)];
            String cidade = CIDADES[random.nextInt(CIDADES.length)];

            String cliente = nome + " - " + cidade;
            clientes.add(cliente);
        }

        return clientes;
    }

    public List<String> gerarFuncionariosFicticios(int quantidade) {
        List<String> funcionarios = new ArrayList<>();

        for (int i = 0; i < quantidade; i++) {
            String nome = NOMES[random.nextInt(NOMES.length)];
            String funcionario = "Funcionario: " + nome;

            funcionarios.add(funcionario);
        }

        return funcionarios;
    }

    public List<String> gerarSolicitacoesFicticias(int quantidade) {
        List<String> solicitacoes = new ArrayList<>();

        for (int i = 0; i < quantidade; i++) {
            String status = STATUS[random.nextInt(STATUS.length)];
            String solicitacao = "Solicitação #" + (i + 1) + " - " + status;

            solicitacoes.add(solicitacao);
        }

        return solicitacoes;
    }

    public void executarSeeder() {
        List<String> clientes = gerarClientesFicticios(4);
        List<String> funcionarios = gerarFuncionariosFicticios(2);
        List<String> solicitacoes = gerarSolicitacoesFicticias(20);

        System.out.println("=== CLIENTES ===");
        clientes.forEach(System.out::println);

        System.out.println("\n=== FUNCIONÁRIOS ===");
        funcionarios.forEach(System.out::println);

        System.out.println("\n=== SOLICITAÇÕES ===");
        solicitacoes.forEach(System.out::println);
    }
}
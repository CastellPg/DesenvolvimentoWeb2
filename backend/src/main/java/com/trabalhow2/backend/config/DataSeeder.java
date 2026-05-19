package com.trabalhow2.backend.config;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.trabalhow2.backend.model.Categoria;
import com.trabalhow2.backend.model.Cliente;
import com.trabalhow2.backend.model.Funcionario;
import com.trabalhow2.backend.model.HistoricoSolicitacao;
import com.trabalhow2.backend.model.ItemOrcamento;
import com.trabalhow2.backend.model.Manutencao;
import com.trabalhow2.backend.model.Orcamento;
import com.trabalhow2.backend.model.Solicitacao;
import com.trabalhow2.backend.model.Usuario;
import com.trabalhow2.backend.model.enums.Perfil;
import com.trabalhow2.backend.model.enums.StatusSolicitacao;
import com.trabalhow2.backend.model.enums.TipoItem;
import com.trabalhow2.backend.repository.CategoriaRepository;
import com.trabalhow2.backend.repository.ClienteRepository;
import com.trabalhow2.backend.repository.FuncionarioRepository;
import com.trabalhow2.backend.repository.HistoricoSolicitacaoRepository;
import com.trabalhow2.backend.repository.ManutencaoRepository;
import com.trabalhow2.backend.repository.OrcamentoRepository;
import com.trabalhow2.backend.repository.SolicitacaoRepository;
import com.trabalhow2.backend.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final ClienteRepository clienteRepository;
    private final FuncionarioRepository funcionarioRepository;
    private final CategoriaRepository categoriaRepository;
    private final SolicitacaoRepository solicitacaoRepository;
    private final OrcamentoRepository orcamentoRepository;
    private final ManutencaoRepository manutencaoRepository;
    private final HistoricoSolicitacaoRepository historicoSolicitacaoRepository;

    @Value("${app.seeder.enabled:true}")
    private boolean seederEnabled;

    @Override
    @Transactional
    public void run(String... args) {
        if (!seederEnabled) {
            return;
        }

        Map<String, Categoria> categorias = seedCategorias();

        Funcionario ana = seedFuncionario(
                "Ana Técnica",
                "ana.tecnica@devweb2.com",
                "1111",
                LocalDate.of(1995, 3, 14)
        );

        Funcionario bruno = seedFuncionario(
                "Bruno Manutenção",
                "bruno.manutencao@devweb2.com",
                "2222",
                LocalDate.of(1992, 8, 22)
        );

        Funcionario carla = seedFuncionario(
                "Carla Suporte",
                "carla.suporte@devweb2.com",
                "3333",
                LocalDate.of(1998, 6, 10)
        );

        Funcionario diego = seedFuncionario(
                "Diego Técnico",
                "diego.tecnico@devweb2.com",
                "4444",
                LocalDate.of(1990, 11, 5)
        );

        Cliente maria = seedCliente(
                "Maria Oliveira",
                "maria.cliente@devweb2.com",
                "1234",
                "12345678901",
                "(41) 99999-1001",
                "80010000",
                "Rua XV de Novembro",
                "100",
                "Apto 301",
                "Centro",
                "Curitiba",
                "PR"
        );

        Cliente joao = seedCliente(
                "João Pereira",
                "joao.cliente@devweb2.com",
                "2345",
                "23456789012",
                "(41) 98888-2002",
                "80240030",
                "Avenida República Argentina",
                "2200",
                "Casa",
                "Água Verde",
                "Curitiba",
                "PR"
        );

        Cliente camila = seedCliente(
                "Camila Santos",
                "camila.cliente@devweb2.com",
                "3456",
                "34567890123",
                "(41) 97777-3003",
                "80530000",
                "Rua Padre Anchieta",
                "850",
                "Bloco B",
                "Bigorrilho",
                "Curitiba",
                "PR"
        );

        Cliente pedro = seedCliente(
                "Pedro Almeida",
                "pedro.cliente@devweb2.com",
                "4567",
                "45678901234",
                "(41) 96666-4004",
                "82800000",
                "Rua da Cidadania",
                "45",
                "",
                "Cajuru",
                "Curitiba",
                "PR"
        );

        Cliente lucas = seedCliente(
                "Lucas Martins",
                "lucas.cliente@devweb2.com",
                "5678",
                "56789012345",
                "(41) 95555-5005",
                "81020000",
                "Rua João Bettega",
                "720",
                "Casa 2",
                "Portão",
                "Curitiba",
                "PR"
        );

        Cliente fernanda = seedCliente(
                "Fernanda Lima",
                "fernanda.cliente@devweb2.com",
                "6789",
                "67890123456",
                "(41) 94444-6006",
                "80620000",
                "Rua Professor Pedro Viriato Parigot de Souza",
                "1400",
                "Apto 1204",
                "Mossunguê",
                "Curitiba",
                "PR"
        );

        Cliente rafael = seedCliente(
                "Rafael Costa",
                "rafael.cliente@devweb2.com",
                "7890",
                "78901234567",
                "(41) 93333-7007",
                "81530000",
                "Avenida das Torres",
                "3100",
                "",
                "Jardim das Américas",
                "Curitiba",
                "PR"
        );

        Cliente juliana = seedCliente(
                "Juliana Rocha",
                "juliana.cliente@devweb2.com",
                "8901",
                "89012345678",
                "(41) 92222-8008",
                "82200000",
                "Rua Mateus Leme",
                "1800",
                "Sobrado",
                "São Lourenço",
                "Curitiba",
                "PR"
        );

        Cliente gustavo = seedCliente(
                "Gustavo Henrique",
                "gustavo.cliente@devweb2.com",
                "9012",
                "90123456789",
                "(41) 91111-9009",
                "80710000",
                "Rua Desembargador Motta",
                "950",
                "Apto 402",
                "Batel",
                "Curitiba",
                "PR"
        );

        Cliente beatriz = seedCliente(
                "Beatriz Ferreira",
                "beatriz.cliente@devweb2.com",
                "0123",
                "01234567890",
                "(41) 90000-1010",
                "82590000",
                "Rua Fagundes Varela",
                "560",
                "",
                "Tingui",
                "Curitiba",
                "PR"
        );

        if (solicitacaoRepository.count() == 0) {
            seedSolicitacoes(categorias, ana, bruno, maria, joao, camila, pedro);
            seedSolicitacoesExtras(categorias, carla, diego, lucas, fernanda, rafael, juliana, gustavo, beatriz);
        }

        System.out.println("Seeder executado: categorias, funcionários, clientes e solicitações de exemplo disponíveis.");
        System.out.println("Funcionários: ana.tecnica@devweb2.com / 1111 | bruno.manutencao@devweb2.com / 2222");
        System.out.println("Funcionários extras: carla.suporte@devweb2.com / 3333 | diego.tecnico@devweb2.com / 4444");
        System.out.println("Clientes: maria.cliente@devweb2.com / 1234 | joao.cliente@devweb2.com / 2345 | camila.cliente@devweb2.com / 3456 | pedro.cliente@devweb2.com / 4567");
        System.out.println("Clientes extras: lucas.cliente@devweb2.com / 5678 | fernanda.cliente@devweb2.com / 6789 | rafael.cliente@devweb2.com / 7890 | juliana.cliente@devweb2.com / 8901 | gustavo.cliente@devweb2.com / 9012 | beatriz.cliente@devweb2.com / 0123");
    }

    private Map<String, Categoria> seedCategorias() {
        Map<String, Categoria> categorias = new LinkedHashMap<>();

        categorias.put("Notebook", seedCategoria("Notebook"));
        categorias.put("Desktop", seedCategoria("Desktop"));
        categorias.put("Impressora", seedCategoria("Impressora"));
        categorias.put("Smartphone", seedCategoria("Smartphone"));
        categorias.put("Rede", seedCategoria("Rede"));

        return categorias;
    }

    private Categoria seedCategoria(String nome) {
        return categoriaRepository.findByNomeIgnoreCase(nome)
                .map(categoria -> {
                    if (!categoria.getAtivo()) {
                        categoria.setAtivo(true);
                        return categoriaRepository.save(categoria);
                    }
                    return categoria;
                })
                .orElseGet(() -> {
                    Categoria categoria = new Categoria();
                    categoria.setNome(nome);
                    categoria.setAtivo(true);
                    return categoriaRepository.save(categoria);
                });
    }

    private Funcionario seedFuncionario(String nome, String email, String senha, LocalDate dataNascimento) {
        Usuario usuario = seedUsuario(nome, email, senha, Perfil.FUNCIONARIO);

        return funcionarioRepository.findById(usuario.getId())
                .orElseGet(() -> {
                    Funcionario funcionario = new Funcionario();
                    funcionario.setUsuario(usuario);
                    funcionario.setData_nascimento(dataNascimento);
                    return funcionarioRepository.save(funcionario);
                });
    }

    private Cliente seedCliente(
            String nome,
            String email,
            String senha,
            String cpf,
            String telefone,
            String cep,
            String logradouro,
            String numero,
            String complemento,
            String bairro,
            String cidade,
            String estado
    ) {
        Usuario usuario = seedUsuario(nome, email, senha, Perfil.CLIENTE);

        return clienteRepository.findById(usuario.getId())
                .orElseGet(() -> {
                    Cliente cliente = new Cliente();
                    cliente.setUsuario(usuario);
                    cliente.setCpf(cpf.replaceAll("\\D", ""));
                    cliente.setTelefone(telefone);
                    cliente.setCep(cep.replaceAll("\\D", ""));
                    cliente.setLogradouro(logradouro);
                    cliente.setNumero(numero);
                    cliente.setComplemento(complemento);
                    cliente.setBairro(bairro);
                    cliente.setCidade(cidade);
                    cliente.setEstado(estado);
                    return clienteRepository.save(cliente);
                });
    }

    private Usuario seedUsuario(String nome, String email, String senha, Perfil perfil) {
        String emailNormalizado = email.trim().toLowerCase();

        return usuarioRepository.findByEmail(emailNormalizado)
                .orElseGet(() -> {
                    String salt = gerarSalt();
                    String hash = gerarHash(senha, salt);

                    Usuario usuario = new Usuario();
                    usuario.setNome(nome);
                    usuario.setEmail(emailNormalizado);
                    usuario.setSenha(hash);
                    usuario.setSalt(salt);
                    usuario.setPerfil(perfil);
                    usuario.setAtivo(true);

                    return usuarioRepository.save(usuario);
                });
    }

    private void seedSolicitacoes(
            Map<String, Categoria> categorias,
            Funcionario ana,
            Funcionario bruno,
            Cliente maria,
            Cliente joao,
            Cliente camila,
            Cliente pedro
    ) {
        Solicitacao aberta = criarSolicitacao(
                maria,
                categorias.get("Notebook"),
                ana,
                "Notebook Dell Inspiron",
                "Equipamento não liga após queda de energia.",
                StatusSolicitacao.ABERTA,
                LocalDateTime.now().minusDays(8),
                null
        );
        registrarHistorico(aberta, null, StatusSolicitacao.ABERTA, maria.getUsuario(), "Solicitação aberta pelo cliente.");

        Solicitacao orcada = criarSolicitacao(
                joao,
                categorias.get("Desktop"),
                bruno,
                "Desktop gamer",
                "Computador liga, mas não apresenta imagem no monitor.",
                StatusSolicitacao.ORCADA,
                LocalDateTime.now().minusDays(7),
                null
        );
        registrarHistorico(orcada, null, StatusSolicitacao.ABERTA, joao.getUsuario(), "Solicitação aberta pelo cliente.");
        Orcamento orcamentoOrcada = criarOrcamento(orcada, bruno, LocalDateTime.now().minusDays(6),
                new ItemSeed(TipoItem.SERVICO, "Diagnóstico técnico", 1, "80.00"),
                new ItemSeed(TipoItem.PECA, "Cabo HDMI novo", 1, "35.00")
        );
        orcada.setValorOrcado(orcamentoOrcada.getValorTotal());
        solicitacaoRepository.save(orcada);
        registrarHistorico(orcada, StatusSolicitacao.ABERTA, StatusSolicitacao.ORCADA, bruno.getUsuario(), "Orçamento registrado pelo técnico.");

        Solicitacao aprovada = criarSolicitacao(
                camila,
                categorias.get("Smartphone"),
                ana,
                "iPhone 11",
                "Tela quebrada e touch falhando no canto superior.",
                StatusSolicitacao.APROVADA,
                LocalDateTime.now().minusDays(6),
                null
        );
        registrarHistorico(aprovada, null, StatusSolicitacao.ABERTA, camila.getUsuario(), "Solicitação aberta pelo cliente.");
        Orcamento orcamentoAprovada = criarOrcamento(aprovada, ana, LocalDateTime.now().minusDays(5),
                new ItemSeed(TipoItem.PECA, "Tela compatível", 1, "280.00"),
                new ItemSeed(TipoItem.MAO_OBRA, "Troca da tela", 1, "120.00")
        );
        aprovada.setValorOrcado(orcamentoAprovada.getValorTotal());
        solicitacaoRepository.save(aprovada);
        registrarHistorico(aprovada, StatusSolicitacao.ABERTA, StatusSolicitacao.ORCADA, ana.getUsuario(), "Orçamento registrado pelo técnico.");
        registrarHistorico(aprovada, StatusSolicitacao.ORCADA, StatusSolicitacao.APROVADA, camila.getUsuario(), "Orçamento aprovado pelo cliente.");

        Solicitacao rejeitada = criarSolicitacao(
                pedro,
                categorias.get("Impressora"),
                bruno,
                "Impressora HP DeskJet",
                "Impressora puxa papel torto e faz barulho ao imprimir.",
                StatusSolicitacao.REJEITADA,
                LocalDateTime.now().minusDays(6),
                "Valor acima do esperado pelo cliente."
        );
        registrarHistorico(rejeitada, null, StatusSolicitacao.ABERTA, pedro.getUsuario(), "Solicitação aberta pelo cliente.");
        Orcamento orcamentoRejeitada = criarOrcamento(rejeitada, bruno, LocalDateTime.now().minusDays(5),
                new ItemSeed(TipoItem.PECA, "Kit tracionador de papel", 1, "180.00"),
                new ItemSeed(TipoItem.MAO_OBRA, "Limpeza e substituição do kit", 1, "90.00")
        );
        rejeitada.setValorOrcado(orcamentoRejeitada.getValorTotal());
        solicitacaoRepository.save(rejeitada);
        registrarHistorico(rejeitada, StatusSolicitacao.ABERTA, StatusSolicitacao.ORCADA, bruno.getUsuario(), "Orçamento registrado pelo técnico.");
        registrarHistorico(rejeitada, StatusSolicitacao.ORCADA, StatusSolicitacao.REJEITADA, pedro.getUsuario(), "Orçamento rejeitado pelo cliente.");

        Solicitacao redirecionada = criarSolicitacao(
                maria,
                categorias.get("Rede"),
                bruno,
                "Roteador TP-Link",
                "Internet cai várias vezes ao dia e o roteador reinicia sozinho.",
                StatusSolicitacao.REDIRECIONADA,
                LocalDateTime.now().minusDays(5),
                null
        );
        registrarHistorico(redirecionada, null, StatusSolicitacao.ABERTA, maria.getUsuario(), "Solicitação aberta pelo cliente.");
        Orcamento orcamentoRedirecionada = criarOrcamento(redirecionada, ana, LocalDateTime.now().minusDays(4),
                new ItemSeed(TipoItem.SERVICO, "Análise de rede local", 1, "100.00"),
                new ItemSeed(TipoItem.SERVICO, "Reconfiguração de roteador", 1, "85.00")
        );
        redirecionada.setValorOrcado(orcamentoRedirecionada.getValorTotal());
        solicitacaoRepository.save(redirecionada);
        registrarHistorico(redirecionada, StatusSolicitacao.ABERTA, StatusSolicitacao.ORCADA, ana.getUsuario(), "Orçamento registrado pelo técnico.");
        registrarHistorico(redirecionada, StatusSolicitacao.ORCADA, StatusSolicitacao.APROVADA, maria.getUsuario(), "Orçamento aprovado pelo cliente.");
        registrarHistorico(redirecionada, StatusSolicitacao.APROVADA, StatusSolicitacao.REDIRECIONADA, ana.getUsuario(), "Solicitação redirecionada para outro técnico.");

        Solicitacao arrumada = criarSolicitacao(
                joao,
                categorias.get("Notebook"),
                ana,
                "Notebook Lenovo IdeaPad",
                "Teclado com várias teclas sem resposta.",
                StatusSolicitacao.ARRUMADA,
                LocalDateTime.now().minusDays(4),
                null
        );
        registrarHistorico(arrumada, null, StatusSolicitacao.ABERTA, joao.getUsuario(), "Solicitação aberta pelo cliente.");
        Orcamento orcamentoArrumada = criarOrcamento(arrumada, ana, LocalDateTime.now().minusDays(3),
                new ItemSeed(TipoItem.PECA, "Teclado compatível", 1, "160.00"),
                new ItemSeed(TipoItem.MAO_OBRA, "Substituição do teclado", 1, "100.00")
        );
        arrumada.setValorOrcado(orcamentoArrumada.getValorTotal());
        solicitacaoRepository.save(arrumada);
        registrarHistorico(arrumada, StatusSolicitacao.ABERTA, StatusSolicitacao.ORCADA, ana.getUsuario(), "Orçamento registrado pelo técnico.");
        registrarHistorico(arrumada, StatusSolicitacao.ORCADA, StatusSolicitacao.APROVADA, joao.getUsuario(), "Orçamento aprovado pelo cliente.");
        criarManutencao(arrumada, ana, LocalDateTime.now().minusDays(2), "Teclado substituído e equipamento testado.", "Evitar líquidos próximos ao notebook.", "Teclado ABNT2", 75);
        registrarHistorico(arrumada, StatusSolicitacao.APROVADA, StatusSolicitacao.ARRUMADA, ana.getUsuario(), "Manutenção registrada pelo técnico.");

        Solicitacao paga = criarSolicitacao(
                camila,
                categorias.get("Desktop"),
                bruno,
                "PC escritório",
                "Sistema muito lento e travando ao abrir programas.",
                StatusSolicitacao.PAGA,
                LocalDateTime.now().minusDays(3),
                null
        );
        registrarHistorico(paga, null, StatusSolicitacao.ABERTA, camila.getUsuario(), "Solicitação aberta pelo cliente.");
        Orcamento orcamentoPaga = criarOrcamento(paga, bruno, LocalDateTime.now().minusDays(2),
                new ItemSeed(TipoItem.PECA, "SSD 480GB", 1, "240.00"),
                new ItemSeed(TipoItem.SERVICO, "Migração de sistema", 1, "150.00"),
                new ItemSeed(TipoItem.MAO_OBRA, "Limpeza interna", 1, "70.00")
        );
        paga.setValorOrcado(orcamentoPaga.getValorTotal());
        solicitacaoRepository.save(paga);
        registrarHistorico(paga, StatusSolicitacao.ABERTA, StatusSolicitacao.ORCADA, bruno.getUsuario(), "Orçamento registrado pelo técnico.");
        registrarHistorico(paga, StatusSolicitacao.ORCADA, StatusSolicitacao.APROVADA, camila.getUsuario(), "Orçamento aprovado pelo cliente.");
        criarManutencao(paga, bruno, LocalDateTime.now().minusDays(1), "SSD instalado, sistema migrado e limpeza realizada.", "Manter backup periódico dos arquivos importantes.", "SSD 480GB", 130);
        registrarHistorico(paga, StatusSolicitacao.APROVADA, StatusSolicitacao.ARRUMADA, bruno.getUsuario(), "Manutenção registrada pelo técnico.");
        registrarHistorico(paga, StatusSolicitacao.ARRUMADA, StatusSolicitacao.PAGA, camila.getUsuario(), "Pagamento confirmado pelo cliente.");

        Solicitacao finalizada = criarSolicitacao(
                pedro,
                categorias.get("Smartphone"),
                ana,
                "Samsung Galaxy A52",
                "Bateria descarregando muito rápido.",
                StatusSolicitacao.FINALIZADA,
                LocalDateTime.now().minusDays(10),
                null
        );
        registrarHistorico(finalizada, null, StatusSolicitacao.ABERTA, pedro.getUsuario(), "Solicitação aberta pelo cliente.");
        Orcamento orcamentoFinalizada = criarOrcamento(finalizada, ana, LocalDateTime.now().minusDays(9),
                new ItemSeed(TipoItem.PECA, "Bateria compatível", 1, "190.00"),
                new ItemSeed(TipoItem.MAO_OBRA, "Troca da bateria", 1, "110.00")
        );
        finalizada.setValorOrcado(orcamentoFinalizada.getValorTotal());
        solicitacaoRepository.save(finalizada);
        registrarHistorico(finalizada, StatusSolicitacao.ABERTA, StatusSolicitacao.ORCADA, ana.getUsuario(), "Orçamento registrado pelo técnico.");
        registrarHistorico(finalizada, StatusSolicitacao.ORCADA, StatusSolicitacao.APROVADA, pedro.getUsuario(), "Orçamento aprovado pelo cliente.");
        criarManutencao(finalizada, ana, LocalDateTime.now().minusDays(8), "Bateria substituída e ciclos de carga testados.", "Carregar com fonte original e evitar descarga completa frequente.", "Bateria Galaxy A52", 60);
        registrarHistorico(finalizada, StatusSolicitacao.APROVADA, StatusSolicitacao.ARRUMADA, ana.getUsuario(), "Manutenção registrada pelo técnico.");
        registrarHistorico(finalizada, StatusSolicitacao.ARRUMADA, StatusSolicitacao.PAGA, pedro.getUsuario(), "Pagamento confirmado pelo cliente.");
        registrarHistorico(finalizada, StatusSolicitacao.PAGA, StatusSolicitacao.FINALIZADA, ana.getUsuario(), "Solicitação finalizada pelo funcionário.");
    }

    private void seedSolicitacoesExtras(
            Map<String, Categoria> categorias,
            Funcionario carla,
            Funcionario diego,
            Cliente lucas,
            Cliente fernanda,
            Cliente rafael,
            Cliente juliana,
            Cliente gustavo,
            Cliente beatriz
    ) {
        Solicitacao notebookAquecendo = criarSolicitacao(
                lucas,
                categorias.get("Notebook"),
                carla,
                "Notebook Samsung Book",
                "Notebook esquenta muito e desliga durante o uso.",
                StatusSolicitacao.ORCADA,
                LocalDateTime.now().minusDays(12),
                null
        );
        registrarHistorico(notebookAquecendo, null, StatusSolicitacao.ABERTA, lucas.getUsuario(), "Solicitação aberta pelo cliente.");
        Orcamento orcamentoNotebookAquecendo = criarOrcamento(notebookAquecendo, carla, LocalDateTime.now().minusDays(11),
                new ItemSeed(TipoItem.SERVICO, "Limpeza interna completa", 1, "120.00"),
                new ItemSeed(TipoItem.MAO_OBRA, "Troca de pasta térmica", 1, "90.00")
        );
        notebookAquecendo.setValorOrcado(orcamentoNotebookAquecendo.getValorTotal());
        solicitacaoRepository.save(notebookAquecendo);
        registrarHistorico(notebookAquecendo, StatusSolicitacao.ABERTA, StatusSolicitacao.ORCADA, carla.getUsuario(), "Orçamento registrado pelo técnico.");

        Solicitacao desktopFonte = criarSolicitacao(
                fernanda,
                categorias.get("Desktop"),
                diego,
                "Desktop Dell Optiplex",
                "Computador reinicia sozinho ao abrir programas pesados.",
                StatusSolicitacao.APROVADA,
                LocalDateTime.now().minusDays(11),
                null
        );
        registrarHistorico(desktopFonte, null, StatusSolicitacao.ABERTA, fernanda.getUsuario(), "Solicitação aberta pelo cliente.");
        Orcamento orcamentoDesktopFonte = criarOrcamento(desktopFonte, diego, LocalDateTime.now().minusDays(10),
                new ItemSeed(TipoItem.PECA, "Fonte 500W", 1, "220.00"),
                new ItemSeed(TipoItem.MAO_OBRA, "Substituição da fonte", 1, "100.00")
        );
        desktopFonte.setValorOrcado(orcamentoDesktopFonte.getValorTotal());
        solicitacaoRepository.save(desktopFonte);
        registrarHistorico(desktopFonte, StatusSolicitacao.ABERTA, StatusSolicitacao.ORCADA, diego.getUsuario(), "Orçamento registrado pelo técnico.");
        registrarHistorico(desktopFonte, StatusSolicitacao.ORCADA, StatusSolicitacao.APROVADA, fernanda.getUsuario(), "Orçamento aprovado pelo cliente.");

        Solicitacao smartphoneCamera = criarSolicitacao(
                rafael,
                categorias.get("Smartphone"),
                carla,
                "Motorola Edge",
                "Câmera traseira não foca e o aplicativo fecha sozinho.",
                StatusSolicitacao.REJEITADA,
                LocalDateTime.now().minusDays(10),
                "Cliente decidiu trocar de aparelho."
        );
        registrarHistorico(smartphoneCamera, null, StatusSolicitacao.ABERTA, rafael.getUsuario(), "Solicitação aberta pelo cliente.");
        Orcamento orcamentoSmartphoneCamera = criarOrcamento(smartphoneCamera, carla, LocalDateTime.now().minusDays(9),
                new ItemSeed(TipoItem.PECA, "Módulo de câmera traseira", 1, "260.00"),
                new ItemSeed(TipoItem.MAO_OBRA, "Troca do módulo de câmera", 1, "130.00")
        );
        smartphoneCamera.setValorOrcado(orcamentoSmartphoneCamera.getValorTotal());
        solicitacaoRepository.save(smartphoneCamera);
        registrarHistorico(smartphoneCamera, StatusSolicitacao.ABERTA, StatusSolicitacao.ORCADA, carla.getUsuario(), "Orçamento registrado pelo técnico.");
        registrarHistorico(smartphoneCamera, StatusSolicitacao.ORCADA, StatusSolicitacao.REJEITADA, rafael.getUsuario(), "Orçamento rejeitado pelo cliente.");

        Solicitacao impressoraTinta = criarSolicitacao(
                juliana,
                categorias.get("Impressora"),
                diego,
                "Impressora Canon G3110",
                "Impressora não reconhece tinta preta e não conclui impressão.",
                StatusSolicitacao.ARRUMADA,
                LocalDateTime.now().minusDays(9),
                null
        );
        registrarHistorico(impressoraTinta, null, StatusSolicitacao.ABERTA, juliana.getUsuario(), "Solicitação aberta pelo cliente.");
        Orcamento orcamentoImpressoraTinta = criarOrcamento(impressoraTinta, diego, LocalDateTime.now().minusDays(8),
                new ItemSeed(TipoItem.SERVICO, "Limpeza do sistema de tinta", 1, "110.00"),
                new ItemSeed(TipoItem.SERVICO, "Alinhamento de impressão", 1, "70.00")
        );
        impressoraTinta.setValorOrcado(orcamentoImpressoraTinta.getValorTotal());
        solicitacaoRepository.save(impressoraTinta);
        registrarHistorico(impressoraTinta, StatusSolicitacao.ABERTA, StatusSolicitacao.ORCADA, diego.getUsuario(), "Orçamento registrado pelo técnico.");
        registrarHistorico(impressoraTinta, StatusSolicitacao.ORCADA, StatusSolicitacao.APROVADA, juliana.getUsuario(), "Orçamento aprovado pelo cliente.");
        criarManutencao(impressoraTinta, diego, LocalDateTime.now().minusDays(7), "Sistema de tinta limpo e impressão normalizada.", "Realizar impressões periódicas para evitar entupimento.", "Nenhuma peça substituída", 55);
        registrarHistorico(impressoraTinta, StatusSolicitacao.APROVADA, StatusSolicitacao.ARRUMADA, diego.getUsuario(), "Manutenção registrada pelo técnico.");

        Solicitacao redeCabo = criarSolicitacao(
                gustavo,
                categorias.get("Rede"),
                carla,
                "Rede cabeada residencial",
                "Computador não conecta via cabo de rede, apenas pelo Wi-Fi.",
                StatusSolicitacao.PAGA,
                LocalDateTime.now().minusDays(8),
                null
        );
        registrarHistorico(redeCabo, null, StatusSolicitacao.ABERTA, gustavo.getUsuario(), "Solicitação aberta pelo cliente.");
        Orcamento orcamentoRedeCabo = criarOrcamento(redeCabo, carla, LocalDateTime.now().minusDays(7),
                new ItemSeed(TipoItem.PECA, "Cabo de rede CAT6", 2, "25.00"),
                new ItemSeed(TipoItem.SERVICO, "Teste e crimpagem de pontos de rede", 1, "140.00")
        );
        redeCabo.setValorOrcado(orcamentoRedeCabo.getValorTotal());
        solicitacaoRepository.save(redeCabo);
        registrarHistorico(redeCabo, StatusSolicitacao.ABERTA, StatusSolicitacao.ORCADA, carla.getUsuario(), "Orçamento registrado pelo técnico.");
        registrarHistorico(redeCabo, StatusSolicitacao.ORCADA, StatusSolicitacao.APROVADA, gustavo.getUsuario(), "Orçamento aprovado pelo cliente.");
        criarManutencao(redeCabo, carla, LocalDateTime.now().minusDays(6), "Cabos substituídos e pontos de rede testados.", "Evitar dobrar os cabos próximos aos conectores.", "Cabos CAT6 e conectores RJ45", 80);
        registrarHistorico(redeCabo, StatusSolicitacao.APROVADA, StatusSolicitacao.ARRUMADA, carla.getUsuario(), "Manutenção registrada pelo técnico.");
        registrarHistorico(redeCabo, StatusSolicitacao.ARRUMADA, StatusSolicitacao.PAGA, gustavo.getUsuario(), "Pagamento confirmado pelo cliente.");

        Solicitacao desktopVirus = criarSolicitacao(
                beatriz,
                categorias.get("Desktop"),
                diego,
                "Computador Positivo",
                "Computador abre páginas sozinho e exibe mensagens suspeitas.",
                StatusSolicitacao.FINALIZADA,
                LocalDateTime.now().minusDays(7),
                null
        );
        registrarHistorico(desktopVirus, null, StatusSolicitacao.ABERTA, beatriz.getUsuario(), "Solicitação aberta pelo cliente.");
        Orcamento orcamentoDesktopVirus = criarOrcamento(desktopVirus, diego, LocalDateTime.now().minusDays(6),
                new ItemSeed(TipoItem.SERVICO, "Remoção de malware", 1, "130.00"),
                new ItemSeed(TipoItem.SERVICO, "Configuração de antivírus", 1, "70.00"),
                new ItemSeed(TipoItem.MAO_OBRA, "Backup básico de arquivos", 1, "90.00")
        );
        desktopVirus.setValorOrcado(orcamentoDesktopVirus.getValorTotal());
        solicitacaoRepository.save(desktopVirus);
        registrarHistorico(desktopVirus, StatusSolicitacao.ABERTA, StatusSolicitacao.ORCADA, diego.getUsuario(), "Orçamento registrado pelo técnico.");
        registrarHistorico(desktopVirus, StatusSolicitacao.ORCADA, StatusSolicitacao.APROVADA, beatriz.getUsuario(), "Orçamento aprovado pelo cliente.");
        criarManutencao(desktopVirus, diego, LocalDateTime.now().minusDays(5), "Malwares removidos, navegador redefinido e antivírus configurado.", "Evitar instalar programas de fontes desconhecidas.", "Nenhuma peça substituída", 95);
        registrarHistorico(desktopVirus, StatusSolicitacao.APROVADA, StatusSolicitacao.ARRUMADA, diego.getUsuario(), "Manutenção registrada pelo técnico.");
        registrarHistorico(desktopVirus, StatusSolicitacao.ARRUMADA, StatusSolicitacao.PAGA, beatriz.getUsuario(), "Pagamento confirmado pelo cliente.");
        registrarHistorico(desktopVirus, StatusSolicitacao.PAGA, StatusSolicitacao.FINALIZADA, diego.getUsuario(), "Solicitação finalizada pelo funcionário.");
    }

    private Solicitacao criarSolicitacao(
            Cliente cliente,
            Categoria categoria,
            Funcionario funcionario,
            String descricaoEquipamento,
            String descricaoDefeito,
            StatusSolicitacao status,
            LocalDateTime dataCriacao,
            String motivoRejeicao
    ) {
        Solicitacao solicitacao = new Solicitacao();
        solicitacao.setCliente(cliente);
        solicitacao.setCategoria(categoria);
        solicitacao.setFuncionario(funcionario);
        solicitacao.setDescricaoEquipamento(descricaoEquipamento);
        solicitacao.setDescricaoDefeito(descricaoDefeito);
        solicitacao.setStatus(status);
        solicitacao.setDataCriacao(dataCriacao);
        solicitacao.setMotivoRejeicao(motivoRejeicao);
        solicitacao.setAtivo(true);
        return solicitacaoRepository.save(solicitacao);
    }

    private Orcamento criarOrcamento(
            Solicitacao solicitacao,
            Funcionario funcionario,
            LocalDateTime dataHora,
            ItemSeed... itens
    ) {
        Orcamento orcamento = new Orcamento();
        orcamento.setSolicitacao(solicitacao);
        orcamento.setFuncionario(funcionario);
        orcamento.setDataHora(dataHora);
        orcamento.setVersao(1);

        BigDecimal valorTotal = BigDecimal.ZERO;

        for (ItemSeed itemSeed : itens) {
            BigDecimal valorUnitario = new BigDecimal(itemSeed.valorUnitario());
            BigDecimal valorItem = valorUnitario.multiply(BigDecimal.valueOf(itemSeed.quantidade()));

            ItemOrcamento item = new ItemOrcamento();
            item.setOrcamento(orcamento);
            item.setTipo(itemSeed.tipo());
            item.setDescricao(itemSeed.descricao());
            item.setQuantidade(itemSeed.quantidade());
            item.setValorUnitario(valorUnitario);
            item.setValorTotal(valorItem);

            orcamento.getItens().add(item);
            valorTotal = valorTotal.add(valorItem);
        }

        orcamento.setValorTotal(valorTotal);
        return orcamentoRepository.save(orcamento);
    }

    private Manutencao criarManutencao(
            Solicitacao solicitacao,
            Funcionario funcionario,
            LocalDateTime dataHora,
            String descricaoManutencao,
            String orientacoesCliente,
            String pecasUsadas,
            Integer tempoGasto
    ) {
        Manutencao manutencao = new Manutencao();
        manutencao.setSolicitacao(solicitacao);
        manutencao.setFuncionario(funcionario);
        manutencao.setDataHora(dataHora);
        manutencao.setDescricaoManutencao(descricaoManutencao);
        manutencao.setOrientacoesCliente(orientacoesCliente);
        manutencao.setPecasUsadas(pecasUsadas);
        manutencao.setTempoGasto(tempoGasto);
        return manutencaoRepository.save(manutencao);
    }

    private void registrarHistorico(
            Solicitacao solicitacao,
            StatusSolicitacao estadoAnterior,
            StatusSolicitacao estadoNovo,
            Usuario usuarioResponsavel,
            String observacoes
    ) {
        historicoSolicitacaoRepository.save(HistoricoSolicitacao.criarRegistro(
                solicitacao,
                estadoAnterior == null ? null : estadoAnterior.name(),
                estadoNovo.name(),
                usuarioResponsavel,
                observacoes
        ));
    }

    private String gerarSalt() {
        SecureRandom random = new SecureRandom();
        byte[] salt = new byte[16];
        random.nextBytes(salt);
        return Base64.getEncoder().encodeToString(salt);
    }

    private String gerarHash(String senha, String salt) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            String senhaComSalt = senha + salt;
            byte[] hashBytes = md.digest(senhaComSalt.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hashBytes);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Erro ao gerar hash da senha do seeder.", e);
        }
    }

    private record ItemSeed(TipoItem tipo, String descricao, int quantidade, String valorUnitario) {
    }
}
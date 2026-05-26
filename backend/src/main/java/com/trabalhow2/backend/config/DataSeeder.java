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

        Funcionario mariaFuncionario = seedFuncionario(
                "Maria",
                "maria.funcionario@devweb2.com",
                "1111",
                LocalDate.of(1995, 3, 14)
        );

        Funcionario marioFuncionario = seedFuncionario(
                "Mário",
                "mario.funcionario@devweb2.com",
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

        Cliente joao = seedCliente(
                "João",
                "joao.cliente@devweb2.com",
                "2345",
                "12345678901",
                "(41) 98888-2002",
                "80240030",
                "Avenida República Argentina",
                "2200",
                "Casa",
                "Água Verde",
                "Curitiba",
                "PR"
        );

        Cliente jose = seedCliente(
                "José",
                "jose.cliente@devweb2.com",
                "3456",
                "23456789012",
                "(41) 97777-3003",
                "80530000",
                "Rua Padre Anchieta",
                "850",
                "Casa",
                "Bigorrilho",
                "Curitiba",
                "PR"
        );

        Cliente joana = seedCliente(
                "Joana",
                "joana.cliente@devweb2.com",
                "4567",
                "34567890123",
                "(41) 96666-4004",
                "82800000",
                "Rua da Cidadania",
                "45",
                "",
                "Cajuru",
                "Curitiba",
                "PR"
        );

        Cliente joaquina = seedCliente(
                "Joaquina",
                "joaquina.cliente@devweb2.com",
                "5678",
                "45678901234",
                "(41) 95555-5005",
                "81020000",
                "Rua João Bettega",
                "720",
                "Casa 2",
                "Portão",
                "Curitiba",
                "PR"
        );

        Cliente lucas = seedCliente(
                "Lucas Martins",
                "lucas.cliente@devweb2.com",
                "6789",
                "56789012345",
                "(41) 94444-6006",
                "80620000",
                "Rua Professor Pedro Viriato Parigot de Souza",
                "1400",
                "Apto 1204",
                "Mossunguê",
                "Curitiba",
                "PR"
        );

        Cliente fernanda = seedCliente(
                "Fernanda Lima",
                "fernanda.cliente@devweb2.com",
                "7890",
                "67890123456",
                "(41) 93333-7007",
                "81530000",
                "Avenida das Torres",
                "3100",
                "",
                "Jardim das Américas",
                "Curitiba",
                "PR"
        );

        Cliente rafael = seedCliente(
                "Rafael Costa",
                "rafael.cliente@devweb2.com",
                "8901",
                "78901234567",
                "(41) 92222-8008",
                "82200000",
                "Rua Mateus Leme",
                "1800",
                "Sobrado",
                "São Lourenço",
                "Curitiba",
                "PR"
        );

        Cliente juliana = seedCliente(
                "Juliana Rocha",
                "juliana.cliente@devweb2.com",
                "9012",
                "89012345678",
                "(41) 91111-9009",
                "80710000",
                "Rua Desembargador Motta",
                "950",
                "Apto 402",
                "Batel",
                "Curitiba",
                "PR"
        );

        Cliente gustavo = seedCliente(
                "Gustavo Henrique",
                "gustavo.cliente@devweb2.com",
                "0123",
                "90123456789",
                "(41) 90000-1010",
                "82590000",
                "Rua Fagundes Varela",
                "560",
                "",
                "Tingui",
                "Curitiba",
                "PR"
        );

        Cliente beatriz = seedCliente(
                "Beatriz Ferreira",
                "beatriz.cliente@devweb2.com",
                "1357",
                "01234567890",
                "(41) 99999-1010",
                "80010000",
                "Rua XV de Novembro",
                "100",
                "Apto 301",
                "Centro",
                "Curitiba",
                "PR"
        );
        if (solicitacaoRepository.count() < 10) {
            seedSolicitacoes(categorias, mariaFuncionario, marioFuncionario, joao, jose, joana, joaquina);
            seedSolicitacoesExtras(categorias, carla, diego, lucas, fernanda, rafael, juliana, gustavo, beatriz);
            seedSolicitacoesComplementares(categorias, mariaFuncionario, marioFuncionario, joao, jose, joana, joaquina);
        }
    }

    private Map<String, Categoria> seedCategorias() {
        Map<String, Categoria> categorias = new LinkedHashMap<>();

        categorias.put("Notebook", seedCategoria("Notebook"));
        categorias.put("Desktop", seedCategoria("Desktop"));
        categorias.put("Impressora", seedCategoria("Impressora"));
        categorias.put("Mouse", seedCategoria("Mouse"));
        categorias.put("Teclado", seedCategoria("Teclado"));

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
                .map(usuario -> {
                    boolean alterado = false;

                    if (!nome.equals(usuario.getNome())) {
                        usuario.setNome(nome);
                        alterado = true;
                    }

                    if (!perfil.equals(usuario.getPerfil())) {
                        usuario.setPerfil(perfil);
                        alterado = true;
                    }

                    if (!usuario.isAtivo()) {
                        usuario.setAtivo(true);
                        alterado = true;
                    }

                    return alterado ? usuarioRepository.save(usuario) : usuario;
                })
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
            Funcionario mariaFuncionario,
            Funcionario marioFuncionario,
            Cliente joao,
            Cliente jose,
            Cliente joana,
            Cliente joaquina
    ) {
        Solicitacao aberta = criarSolicitacao(
                joao,
                categorias.get("Notebook"),
                mariaFuncionario,
                "Notebook Dell Inspiron",
                "Equipamento não liga após queda de energia.",
                StatusSolicitacao.ABERTA,
                LocalDateTime.now().minusDays(8),
                null
        );
        registrarHistorico(aberta, null, StatusSolicitacao.ABERTA, joao.getUsuario(), "Solicitação aberta pelo cliente.");

        Solicitacao orcada = criarSolicitacao(
                jose,
                categorias.get("Desktop"),
                marioFuncionario,
                "Desktop gamer",
                "Computador liga, mas não apresenta imagem no monitor.",
                StatusSolicitacao.ORCADA,
                LocalDateTime.now().minusDays(7),
                null
        );
        registrarHistorico(orcada, null, StatusSolicitacao.ABERTA, jose.getUsuario(), "Solicitação aberta pelo cliente.");
        Orcamento orcamentoOrcada = criarOrcamento(orcada, marioFuncionario, LocalDateTime.now().minusDays(6),
                new ItemSeed(TipoItem.SERVICO, "Diagnóstico técnico", 1, "80.00"),
                new ItemSeed(TipoItem.PECA, "Cabo HDMI novo", 1, "35.00")
        );
        orcada.setValorOrcado(orcamentoOrcada.getValorTotal());
        solicitacaoRepository.save(orcada);
        registrarHistorico(orcada, StatusSolicitacao.ABERTA, StatusSolicitacao.ORCADA, marioFuncionario.getUsuario(), "Orçamento registrado pelo técnico.");

        Solicitacao aprovada = criarSolicitacao(
                joana,
                categorias.get("Mouse"),
                mariaFuncionario,
                "Mouse Logitech G203",
                "Mouse apresenta duplo clique e falha no botão esquerdo.",
                StatusSolicitacao.APROVADA,
                LocalDateTime.now().minusDays(6),
                null
        );
        registrarHistorico(aprovada, null, StatusSolicitacao.ABERTA, joana.getUsuario(), "Solicitação aberta pelo cliente.");
        Orcamento orcamentoAprovada = criarOrcamento(aprovada, mariaFuncionario, LocalDateTime.now().minusDays(5),
                new ItemSeed(TipoItem.PECA, "Micro switch", 2, "25.00"),
                new ItemSeed(TipoItem.MAO_OBRA, "Reparo dos botões", 1, "80.00")
        );
        aprovada.setValorOrcado(orcamentoAprovada.getValorTotal());
        solicitacaoRepository.save(aprovada);
        registrarHistorico(aprovada, StatusSolicitacao.ABERTA, StatusSolicitacao.ORCADA, mariaFuncionario.getUsuario(), "Orçamento registrado pelo técnico.");
        registrarHistorico(aprovada, StatusSolicitacao.ORCADA, StatusSolicitacao.APROVADA, joana.getUsuario(), "Orçamento aprovado pelo cliente.");

        Solicitacao rejeitada = criarSolicitacao(
                joaquina,
                categorias.get("Impressora"),
                marioFuncionario,
                "Impressora HP DeskJet",
                "Impressora puxa papel torto e faz barulho ao imprimir.",
                StatusSolicitacao.REJEITADA,
                LocalDateTime.now().minusDays(6),
                "Valor acima do esperado pelo cliente."
        );
        registrarHistorico(rejeitada, null, StatusSolicitacao.ABERTA, joaquina.getUsuario(), "Solicitação aberta pelo cliente.");
        Orcamento orcamentoRejeitada = criarOrcamento(rejeitada, marioFuncionario, LocalDateTime.now().minusDays(5),
                new ItemSeed(TipoItem.PECA, "Kit tracionador de papel", 1, "180.00"),
                new ItemSeed(TipoItem.MAO_OBRA, "Limpeza e substituição do kit", 1, "90.00")
        );
        rejeitada.setValorOrcado(orcamentoRejeitada.getValorTotal());
        solicitacaoRepository.save(rejeitada);
        registrarHistorico(rejeitada, StatusSolicitacao.ABERTA, StatusSolicitacao.ORCADA, marioFuncionario.getUsuario(), "Orçamento registrado pelo técnico.");
        registrarHistorico(rejeitada, StatusSolicitacao.ORCADA, StatusSolicitacao.REJEITADA, joaquina.getUsuario(), "Orçamento rejeitado pelo cliente.");

        Solicitacao redirecionada = criarSolicitacao(
                joao,
                categorias.get("Teclado"),
                marioFuncionario,
                "Teclado mecânico",
                "Teclado apresenta falhas nas teclas A, S e D.",
                StatusSolicitacao.REDIRECIONADA,
                LocalDateTime.now().minusDays(5),
                null
        );
        registrarHistorico(redirecionada, null, StatusSolicitacao.ABERTA, joao.getUsuario(), "Solicitação aberta pelo cliente.");
        Orcamento orcamentoRedirecionada = criarOrcamento(redirecionada, mariaFuncionario, LocalDateTime.now().minusDays(4),
                new ItemSeed(TipoItem.SERVICO, "Análise dos contatos das teclas", 1, "70.00"),
                new ItemSeed(TipoItem.SERVICO, "Limpeza interna do teclado", 1, "65.00")
        );
        redirecionada.setValorOrcado(orcamentoRedirecionada.getValorTotal());
        solicitacaoRepository.save(redirecionada);
        registrarHistorico(redirecionada, StatusSolicitacao.ABERTA, StatusSolicitacao.ORCADA, mariaFuncionario.getUsuario(), "Orçamento registrado pelo técnico.");
        registrarHistorico(redirecionada, StatusSolicitacao.ORCADA, StatusSolicitacao.APROVADA, joao.getUsuario(), "Orçamento aprovado pelo cliente.");
        registrarHistorico(redirecionada, StatusSolicitacao.APROVADA, StatusSolicitacao.REDIRECIONADA, mariaFuncionario.getUsuario(), "Solicitação redirecionada para outro técnico.");

        Solicitacao arrumada = criarSolicitacao(
                jose,
                categorias.get("Notebook"),
                mariaFuncionario,
                "Notebook Lenovo IdeaPad",
                "Teclado com várias teclas sem resposta.",
                StatusSolicitacao.ARRUMADA,
                LocalDateTime.now().minusDays(4),
                null
        );
        registrarHistorico(arrumada, null, StatusSolicitacao.ABERTA, jose.getUsuario(), "Solicitação aberta pelo cliente.");
        Orcamento orcamentoArrumada = criarOrcamento(arrumada, mariaFuncionario, LocalDateTime.now().minusDays(3),
                new ItemSeed(TipoItem.PECA, "Teclado compatível", 1, "160.00"),
                new ItemSeed(TipoItem.MAO_OBRA, "Substituição do teclado", 1, "100.00")
        );
        arrumada.setValorOrcado(orcamentoArrumada.getValorTotal());
        solicitacaoRepository.save(arrumada);
        registrarHistorico(arrumada, StatusSolicitacao.ABERTA, StatusSolicitacao.ORCADA, mariaFuncionario.getUsuario(), "Orçamento registrado pelo técnico.");
        registrarHistorico(arrumada, StatusSolicitacao.ORCADA, StatusSolicitacao.APROVADA, jose.getUsuario(), "Orçamento aprovado pelo cliente.");
        criarManutencao(arrumada, mariaFuncionario, LocalDateTime.now().minusDays(2), "Teclado substituído e equipamento testado.", "Evitar líquidos próximos ao notebook.", "Teclado ABNT2", 75);
        registrarHistorico(arrumada, StatusSolicitacao.APROVADA, StatusSolicitacao.ARRUMADA, mariaFuncionario.getUsuario(), "Manutenção registrada pelo técnico.");

        Solicitacao paga = criarSolicitacao(
                joana,
                categorias.get("Desktop"),
                marioFuncionario,
                "PC escritório",
                "Sistema muito lento e travando ao abrir programas.",
                StatusSolicitacao.PAGA,
                LocalDateTime.now().minusDays(3),
                null
        );
        registrarHistorico(paga, null, StatusSolicitacao.ABERTA, joana.getUsuario(), "Solicitação aberta pelo cliente.");
        Orcamento orcamentoPaga = criarOrcamento(paga, marioFuncionario, LocalDateTime.now().minusDays(2),
                new ItemSeed(TipoItem.PECA, "SSD 480GB", 1, "240.00"),
                new ItemSeed(TipoItem.SERVICO, "Migração de sistema", 1, "150.00"),
                new ItemSeed(TipoItem.MAO_OBRA, "Limpeza interna", 1, "70.00")
        );
        paga.setValorOrcado(orcamentoPaga.getValorTotal());
        solicitacaoRepository.save(paga);
        registrarHistorico(paga, StatusSolicitacao.ABERTA, StatusSolicitacao.ORCADA, marioFuncionario.getUsuario(), "Orçamento registrado pelo técnico.");
        registrarHistorico(paga, StatusSolicitacao.ORCADA, StatusSolicitacao.APROVADA, joana.getUsuario(), "Orçamento aprovado pelo cliente.");
        criarManutencao(paga, marioFuncionario, LocalDateTime.now().minusDays(1), "SSD instalado, sistema migrado e limpeza realizada.", "Manter backup periódico dos arquivos importantes.", "SSD 480GB", 130);
        registrarHistorico(paga, StatusSolicitacao.APROVADA, StatusSolicitacao.ARRUMADA, marioFuncionario.getUsuario(), "Manutenção registrada pelo técnico.");
        registrarHistorico(paga, StatusSolicitacao.ARRUMADA, StatusSolicitacao.PAGA, joana.getUsuario(), "Pagamento confirmado pelo cliente.");

        Solicitacao finalizada = criarSolicitacao(
                joaquina,
                categorias.get("Mouse"),
                mariaFuncionario,
                "Mouse sem fio Dell",
                "Mouse descarrega rapidamente e falha durante o uso.",
                StatusSolicitacao.FINALIZADA,
                LocalDateTime.now().minusDays(10),
                null
        );
        registrarHistorico(finalizada, null, StatusSolicitacao.ABERTA, joaquina.getUsuario(), "Solicitação aberta pelo cliente.");
        Orcamento orcamentoFinalizada = criarOrcamento(finalizada, mariaFuncionario, LocalDateTime.now().minusDays(9),
                new ItemSeed(TipoItem.PECA, "Sensor óptico compatível", 1, "90.00"),
                new ItemSeed(TipoItem.MAO_OBRA, "Reparo do circuito interno", 1, "80.00")
        );
        finalizada.setValorOrcado(orcamentoFinalizada.getValorTotal());
        solicitacaoRepository.save(finalizada);
        registrarHistorico(finalizada, StatusSolicitacao.ABERTA, StatusSolicitacao.ORCADA, mariaFuncionario.getUsuario(), "Orçamento registrado pelo técnico.");
        registrarHistorico(finalizada, StatusSolicitacao.ORCADA, StatusSolicitacao.APROVADA, joaquina.getUsuario(), "Orçamento aprovado pelo cliente.");
        criarManutencao(finalizada, mariaFuncionario, LocalDateTime.now().minusDays(8), "Circuito revisado e sensor substituído.", "Usar pilhas de boa qualidade e evitar quedas.", "Sensor óptico", 60);
        registrarHistorico(finalizada, StatusSolicitacao.APROVADA, StatusSolicitacao.ARRUMADA, mariaFuncionario.getUsuario(), "Manutenção registrada pelo técnico.");
        registrarHistorico(finalizada, StatusSolicitacao.ARRUMADA, StatusSolicitacao.PAGA, joaquina.getUsuario(), "Pagamento confirmado pelo cliente.");
        registrarHistorico(finalizada, StatusSolicitacao.PAGA, StatusSolicitacao.FINALIZADA, mariaFuncionario.getUsuario(), "Solicitação finalizada pelo funcionário.");
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

        Solicitacao mouseCamera = criarSolicitacao(
                rafael,
                categorias.get("Mouse"),
                carla,
                "Mouse Gamer HyperX",
                "Botão lateral não funciona e o scroll apresenta falhas.",
                StatusSolicitacao.REJEITADA,
                LocalDateTime.now().minusDays(10),
                "Cliente decidiu comprar outro mouse."
        );
        registrarHistorico(mouseCamera, null, StatusSolicitacao.ABERTA, rafael.getUsuario(), "Solicitação aberta pelo cliente.");
        Orcamento orcamentoMouseCamera = criarOrcamento(mouseCamera, carla, LocalDateTime.now().minusDays(9),
                new ItemSeed(TipoItem.PECA, "Encoder de scroll", 1, "55.00"),
                new ItemSeed(TipoItem.MAO_OBRA, "Reparo dos botões", 1, "75.00")
        );
        mouseCamera.setValorOrcado(orcamentoMouseCamera.getValorTotal());
        solicitacaoRepository.save(mouseCamera);
        registrarHistorico(mouseCamera, StatusSolicitacao.ABERTA, StatusSolicitacao.ORCADA, carla.getUsuario(), "Orçamento registrado pelo técnico.");
        registrarHistorico(mouseCamera, StatusSolicitacao.ORCADA, StatusSolicitacao.REJEITADA, rafael.getUsuario(), "Orçamento rejeitado pelo cliente.");

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

        Solicitacao tecladoCabo = criarSolicitacao(
                gustavo,
                categorias.get("Teclado"),
                carla,
                "Teclado USB Multilaser",
                "Computador não reconhece o teclado em nenhuma porta USB.",
                StatusSolicitacao.PAGA,
                LocalDateTime.now().minusDays(8),
                null
        );
        registrarHistorico(tecladoCabo, null, StatusSolicitacao.ABERTA, gustavo.getUsuario(), "Solicitação aberta pelo cliente.");
        Orcamento orcamentoTecladoCabo = criarOrcamento(tecladoCabo, carla, LocalDateTime.now().minusDays(7),
                new ItemSeed(TipoItem.PECA, "Cabo USB novo", 1, "35.00"),
                new ItemSeed(TipoItem.SERVICO, "Troca do cabo e teste dos contatos", 1, "90.00")
        );
        tecladoCabo.setValorOrcado(orcamentoTecladoCabo.getValorTotal());
        solicitacaoRepository.save(tecladoCabo);
        registrarHistorico(tecladoCabo, StatusSolicitacao.ABERTA, StatusSolicitacao.ORCADA, carla.getUsuario(), "Orçamento registrado pelo técnico.");
        registrarHistorico(tecladoCabo, StatusSolicitacao.ORCADA, StatusSolicitacao.APROVADA, gustavo.getUsuario(), "Orçamento aprovado pelo cliente.");
        criarManutencao(tecladoCabo, carla, LocalDateTime.now().minusDays(6), "Cabo substituído e teclado testado.", "Evitar dobrar o cabo próximo ao conector.", "Cabo USB", 80);
        registrarHistorico(tecladoCabo, StatusSolicitacao.APROVADA, StatusSolicitacao.ARRUMADA, carla.getUsuario(), "Manutenção registrada pelo técnico.");
        registrarHistorico(tecladoCabo, StatusSolicitacao.ARRUMADA, StatusSolicitacao.PAGA, gustavo.getUsuario(), "Pagamento confirmado pelo cliente.");

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

    private void seedSolicitacoesComplementares(
            Map<String, Categoria> categorias,
            Funcionario mariaFuncionario,
            Funcionario marioFuncionario,
            Cliente joao,
            Cliente jose,
            Cliente joana,
            Cliente joaquina
    ) {
        Solicitacao abertaMouse = criarSolicitacao(
                joao,
                categorias.get("Mouse"),
                mariaFuncionario,
                "Mouse Logitech M170",
                "Mouse não responde aos cliques e apresenta falha no sensor.",
                StatusSolicitacao.ABERTA,
                LocalDateTime.now().minusDays(14),
                null
        );
        registrarHistorico(abertaMouse, null, StatusSolicitacao.ABERTA, joao.getUsuario(), "Solicitação aberta pelo cliente.");

        Solicitacao abertaTeclado = criarSolicitacao(
                jose,
                categorias.get("Teclado"),
                marioFuncionario,
                "Teclado Redragon Kumara",
                "Algumas teclas não funcionam e o cabo apresenta mau contato.",
                StatusSolicitacao.ABERTA,
                LocalDateTime.now().minusDays(13),
                null
        );
        registrarHistorico(abertaTeclado, null, StatusSolicitacao.ABERTA, jose.getUsuario(), "Solicitação aberta pelo cliente.");

        Solicitacao orcadaMouse = criarSolicitacao(
                joana,
                categorias.get("Mouse"),
                mariaFuncionario,
                "Mouse Gamer HyperX",
                "Botão esquerdo com duplo clique involuntário.",
                StatusSolicitacao.ORCADA,
                LocalDateTime.now().minusDays(12),
                null
        );
        registrarHistorico(orcadaMouse, null, StatusSolicitacao.ABERTA, joana.getUsuario(), "Solicitação aberta pelo cliente.");
        Orcamento orcamentoMouse = criarOrcamento(orcadaMouse, mariaFuncionario, LocalDateTime.now().minusDays(11),
                new ItemSeed(TipoItem.SERVICO, "Diagnóstico do mouse", 1, "40.00"),
                new ItemSeed(TipoItem.PECA, "Micro switch", 2, "25.00")
        );
        orcadaMouse.setValorOrcado(orcamentoMouse.getValorTotal());
        solicitacaoRepository.save(orcadaMouse);
        registrarHistorico(orcadaMouse, StatusSolicitacao.ABERTA, StatusSolicitacao.ORCADA, mariaFuncionario.getUsuario(), "Orçamento registrado pelo técnico.");

        Solicitacao aprovadaTeclado = criarSolicitacao(
                joaquina,
                categorias.get("Teclado"),
                marioFuncionario,
                "Teclado Logitech K120",
                "Teclas Enter e Espaço falhando durante digitação.",
                StatusSolicitacao.APROVADA,
                LocalDateTime.now().minusDays(11),
                null
        );
        registrarHistorico(aprovadaTeclado, null, StatusSolicitacao.ABERTA, joaquina.getUsuario(), "Solicitação aberta pelo cliente.");
        Orcamento orcamentoTeclado = criarOrcamento(aprovadaTeclado, marioFuncionario, LocalDateTime.now().minusDays(10),
                new ItemSeed(TipoItem.SERVICO, "Limpeza e revisão de contatos", 1, "70.00"),
                new ItemSeed(TipoItem.MAO_OBRA, "Reparo do teclado", 1, "60.00")
        );
        aprovadaTeclado.setValorOrcado(orcamentoTeclado.getValorTotal());
        solicitacaoRepository.save(aprovadaTeclado);
        registrarHistorico(aprovadaTeclado, StatusSolicitacao.ABERTA, StatusSolicitacao.ORCADA, marioFuncionario.getUsuario(), "Orçamento registrado pelo técnico.");
        registrarHistorico(aprovadaTeclado, StatusSolicitacao.ORCADA, StatusSolicitacao.APROVADA, joaquina.getUsuario(), "Orçamento aprovado pelo cliente.");

        Solicitacao arrumadaNotebook = criarSolicitacao(
                jose,
                categorias.get("Notebook"),
                mariaFuncionario,
                "Notebook Acer Aspire",
                "Ventoinha fazendo ruído alto e aquecimento excessivo.",
                StatusSolicitacao.ARRUMADA,
                LocalDateTime.now().minusDays(10),
                null
        );
        registrarHistorico(arrumadaNotebook, null, StatusSolicitacao.ABERTA, jose.getUsuario(), "Solicitação aberta pelo cliente.");
        Orcamento orcamentoNotebook = criarOrcamento(arrumadaNotebook, mariaFuncionario, LocalDateTime.now().minusDays(9),
                new ItemSeed(TipoItem.SERVICO, "Limpeza interna", 1, "100.00"),
                new ItemSeed(TipoItem.MAO_OBRA, "Troca de pasta térmica", 1, "80.00")
        );
        arrumadaNotebook.setValorOrcado(orcamentoNotebook.getValorTotal());
        solicitacaoRepository.save(arrumadaNotebook);
        registrarHistorico(arrumadaNotebook, StatusSolicitacao.ABERTA, StatusSolicitacao.ORCADA, mariaFuncionario.getUsuario(), "Orçamento registrado pelo técnico.");
        registrarHistorico(arrumadaNotebook, StatusSolicitacao.ORCADA, StatusSolicitacao.APROVADA, jose.getUsuario(), "Orçamento aprovado pelo cliente.");
        criarManutencao(arrumadaNotebook, mariaFuncionario, LocalDateTime.now().minusDays(8), "Limpeza feita e pasta térmica substituída.", "Evitar usar o notebook sobre tecido.", "Pasta térmica", 90);
        registrarHistorico(arrumadaNotebook, StatusSolicitacao.APROVADA, StatusSolicitacao.ARRUMADA, mariaFuncionario.getUsuario(), "Manutenção registrada pelo técnico.");

        Solicitacao finalizadaImpressora = criarSolicitacao(
                joana,
                categorias.get("Impressora"),
                marioFuncionario,
                "Impressora Epson L3150",
                "Impressão saindo falhada e com manchas.",
                StatusSolicitacao.FINALIZADA,
                LocalDateTime.now().minusDays(9),
                null
        );
        registrarHistorico(finalizadaImpressora, null, StatusSolicitacao.ABERTA, joana.getUsuario(), "Solicitação aberta pelo cliente.");
        Orcamento orcamentoImpressora = criarOrcamento(finalizadaImpressora, marioFuncionario, LocalDateTime.now().minusDays(8),
                new ItemSeed(TipoItem.SERVICO, "Limpeza de cabeçote", 1, "120.00"),
                new ItemSeed(TipoItem.SERVICO, "Alinhamento e teste de impressão", 1, "60.00")
        );
        finalizadaImpressora.setValorOrcado(orcamentoImpressora.getValorTotal());
        solicitacaoRepository.save(finalizadaImpressora);
        registrarHistorico(finalizadaImpressora, StatusSolicitacao.ABERTA, StatusSolicitacao.ORCADA, marioFuncionario.getUsuario(), "Orçamento registrado pelo técnico.");
        registrarHistorico(finalizadaImpressora, StatusSolicitacao.ORCADA, StatusSolicitacao.APROVADA, joana.getUsuario(), "Orçamento aprovado pelo cliente.");
        criarManutencao(finalizadaImpressora, marioFuncionario, LocalDateTime.now().minusDays(7), "Cabeçote limpo, alinhamento feito e impressão normalizada.", "Imprimir semanalmente para evitar entupimento.", "Nenhuma peça substituída", 70);
        registrarHistorico(finalizadaImpressora, StatusSolicitacao.APROVADA, StatusSolicitacao.ARRUMADA, marioFuncionario.getUsuario(), "Manutenção registrada pelo técnico.");
        registrarHistorico(finalizadaImpressora, StatusSolicitacao.ARRUMADA, StatusSolicitacao.PAGA, joana.getUsuario(), "Pagamento confirmado pelo cliente.");
        registrarHistorico(finalizadaImpressora, StatusSolicitacao.PAGA, StatusSolicitacao.FINALIZADA, marioFuncionario.getUsuario(), "Solicitação finalizada pelo funcionário.");
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
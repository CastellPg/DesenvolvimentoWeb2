package com.trabalhow2.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.trabalhow2.backend.controller.request.AtualizarCategoriaRequest;
import com.trabalhow2.backend.controller.request.CadastroCategoriaRequest;
import com.trabalhow2.backend.controller.response.CategoriaResponse;
import com.trabalhow2.backend.model.Categoria;
import com.trabalhow2.backend.repository.CategoriaRepository;

@Service
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;

    @Autowired
    public CategoriaService(CategoriaRepository categoriaRepository) {
        this.categoriaRepository = categoriaRepository;
    }

    @Transactional
    public CategoriaResponse criarCategoria(CadastroCategoriaRequest request) {
        String nome = normalizarNome(request.getNome());

        Categoria categoriaInativa = categoriaRepository.findByNomeIgnoreCase(nome)
                .filter(categoria -> !categoria.getAtivo())
                .orElse(null);

        if (categoriaInativa != null) {
            categoriaInativa.setAtivo(true);
            return converterParaCategoriaResponse(categoriaRepository.save(categoriaInativa));
        }

        validarNomeDuplicado(nome);

        Categoria categoria = new Categoria();
        categoria.setNome(nome);
        categoria.setAtivo(true);

        return converterParaCategoriaResponse(categoriaRepository.save(categoria));
    }

    public CategoriaResponse buscarPorId(Long id) {
        Categoria categoria = buscarCategoriaAtiva(id);
        return converterParaCategoriaResponse(categoria);
    }

    public Page<CategoriaResponse> listarTodos(Pageable pageable) {
        return categoriaRepository.findByAtivoTrue(pageable)
                .map(this::converterParaCategoriaResponse);
    }

    @Transactional
    public CategoriaResponse atualizarCategoria(Long id, AtualizarCategoriaRequest request) {
        Categoria categoria = buscarCategoriaAtiva(id);
        String nome = normalizarNome(request.getNome());

        if (categoriaRepository.existsByNomeIgnoreCaseAndIdNot(nome, id)) {
            throw new IllegalArgumentException("Categoria já cadastrada.");
        }

        categoria.setNome(nome);
        return converterParaCategoriaResponse(categoriaRepository.save(categoria));
    }

    @Transactional
    public void removerCategoria(Long id) {
        Categoria categoria = buscarCategoriaAtiva(id);
        categoria.setAtivo(false);
        categoriaRepository.save(categoria);
    }

    private Categoria buscarCategoriaAtiva(Long id) {
        return categoriaRepository.findByIdAndAtivoTrue(id)
                .orElseThrow(() -> new IllegalArgumentException("Categoria não encontrada."));
    }

    private String normalizarNome(String nome) {
        if (nome == null) {
            return "";
        }
        return nome.trim();
    }

    private void validarNomeDuplicado(String nome) {
        if (categoriaRepository.findByNomeIgnoreCase(nome).isPresent()) {
            throw new IllegalArgumentException("Categoria já cadastrada.");
        }
    }

    private CategoriaResponse converterParaCategoriaResponse(Categoria categoria) {
        return new CategoriaResponse(categoria.getId(), categoria.getNome());
    }
}

package com.trabalhow2.backend.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import com.trabalhow2.backend.model.Solicitacao;
import com.trabalhow2.backend.repository.SolicitacaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/api/solicitacoes")
@CrossOrigin(origins = "*")
public class SolicitacaoController {

    @Autowired
    private SolicitacaoRepository solicitacaoRepository;

    //Faz a busca de todas as solicitações de um cliente especifico
    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<List<Solicitacao>> listarPorCliente(@PathVariable Long clienteId){
        List<Solicitacao> solicitacoes = solicitacaoRepository.findByClienteIdOrderByDataHoraDesc(clienteId);

        return ResponseEntity.ok(solicitacoes);
    }

    // Busca os detalhes de uma solicitação pelo id
    @GetMapping("/{id}")
    public ResponseEntity<Solicitacao> buscarPorId(@PathVariable Long id) {

        return solicitacaoRepository.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }   
}

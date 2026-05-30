package com.trabalhow2.backend.config;

import java.io.IOException;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import com.trabalhow2.backend.model.Usuario;
import com.trabalhow2.backend.model.enums.Perfil;
import com.trabalhow2.backend.repository.UsuarioRepository;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class SessionAuthInterceptor implements HandlerInterceptor {

    private final UsuarioRepository usuarioRepository;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws IOException {
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            return true;
        }

        HttpSession session = request.getSession(false);
        if (session == null) {
            respostaNaoAutorizada(response, "Sessao invalida. Faca login novamente.");
            return false;
        }

        Object usuarioIdAttr = session.getAttribute("usuarioId");
        if (!(usuarioIdAttr instanceof Long usuarioId)) {
            session.invalidate();
            respostaNaoAutorizada(response, "Sessao invalida. Faca login novamente.");
            return false;
        }

        Usuario usuario = usuarioRepository.findByIdAndAtivoTrue(usuarioId).orElse(null);
        if (usuario == null) {
            session.invalidate();
            respostaNaoAutorizada(response, "Usuario nao autorizado.");
            return false;
        }

        if (rotaExigePerfilFuncionario(request) && usuario.getPerfil() != Perfil.FUNCIONARIO) {
            respostaAcessoNegado(response, "Acesso permitido apenas para funcionarios.");
            return false;
        }

        if (rotaExigePerfilCliente(request) && usuario.getPerfil() != Perfil.CLIENTE) {
            respostaAcessoNegado(response, "Acesso permitido apenas para clientes.");
            return false;
        }

        String idUsuarioLogado = request.getHeader("idUsuarioLogado");
        if (idUsuarioLogado != null && !idUsuarioLogado.isBlank()) {
            try {
                Long idHeader = Long.parseLong(idUsuarioLogado);
                if (!usuarioId.equals(idHeader)) {
                    respostaAcessoNegado(response, "Usuario logado nao corresponde ao header informado.");
                    return false;
                }
            } catch (NumberFormatException ex) {
                respostaAcessoNegado(response, "Header idUsuarioLogado invalido.");
                return false;
            }
        }

        return true;
    }

    private boolean rotaExigePerfilFuncionario(HttpServletRequest request) {
        String path = request.getRequestURI();
        String method = request.getMethod();

        boolean gestaoCategorias = path.startsWith("/categorias")
                && !"GET".equalsIgnoreCase(method);

        return path.startsWith("/funcionarios")
                || gestaoCategorias
                || path.startsWith("/relatorios/receitas");
    }

    private boolean rotaExigePerfilCliente(HttpServletRequest request) {
        String path = request.getRequestURI();
        return path.startsWith("/clientes") && !path.startsWith("/clientes/cadastro");
    }

    private void respostaNaoAutorizada(HttpServletResponse response, String mensagem) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json;charset=UTF-8");
        response.getWriter().write("{\"status\":401,\"messages\":[\"" + mensagem + "\"]}");
    }

    private void respostaAcessoNegado(HttpServletResponse response, String mensagem) throws IOException {
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        response.setContentType("application/json;charset=UTF-8");
        response.getWriter().write("{\"status\":403,\"messages\":[\"" + mensagem + "\"]}");
    }
}

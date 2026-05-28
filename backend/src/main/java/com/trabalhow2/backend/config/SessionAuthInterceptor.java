package com.trabalhow2.backend.config;

import java.io.IOException;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

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
            respostaNaoAutorizada(response, "Sessão inválida. Faça login novamente.");
            return false;
        }

        Object usuarioIdAttr = session.getAttribute("usuarioId");
        if (!(usuarioIdAttr instanceof Long usuarioId)) {
            session.invalidate();
            respostaNaoAutorizada(response, "Sessão inválida. Faça login novamente.");
            return false;
        }

        if (usuarioRepository.findByIdAndAtivoTrue(usuarioId).isEmpty()) {
            session.invalidate();
            respostaNaoAutorizada(response, "Usuário não autorizado.");
            return false;
        }

        String idUsuarioLogado = request.getHeader("idUsuarioLogado");
        if (idUsuarioLogado != null && !idUsuarioLogado.isBlank()) {
            try {
                Long idHeader = Long.parseLong(idUsuarioLogado);
                if (!usuarioId.equals(idHeader)) {
                    respostaAcessoNegado(response, "Usuário logado não corresponde ao header informado.");
                    return false;
                }
            } catch (NumberFormatException ex) {
                respostaAcessoNegado(response, "Header idUsuarioLogado inválido.");
                return false;
            }
        }

        return true;
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

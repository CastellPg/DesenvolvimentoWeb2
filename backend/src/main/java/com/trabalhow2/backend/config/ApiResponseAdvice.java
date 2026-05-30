package com.trabalhow2.backend.config;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.MethodParameter;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpResponse;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;
import org.springframework.core.io.Resource;

import com.trabalhow2.backend.controller.response.ApiResponse;

@RestControllerAdvice(basePackages = "com.trabalhow2.backend.controller")
public class ApiResponseAdvice implements ResponseBodyAdvice<Object> {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public boolean supports(MethodParameter returnType, Class<? extends HttpMessageConverter<?>> converterType) {
        return true;
    }

    @Override
    public Object beforeBodyWrite(
            Object body,
            MethodParameter returnType,
            MediaType selectedContentType,
            Class<? extends HttpMessageConverter<?>> selectedConverterType,
            ServerHttpRequest request,
            ServerHttpResponse response) {

        int status = 200;
        if (response instanceof ServletServerHttpResponse servletResponse) {
            status = servletResponse.getServletResponse().getStatus();
        }

        if (body instanceof ApiResponse<?>) {
            return body;
        }

        if (body instanceof Resource) {
            return body;
        }

          if (body instanceof byte[]) {
            return body;
        }

        if (selectedContentType != null && selectedContentType.includes(MediaType.APPLICATION_PDF)) {
            return body;
        }

        String path = request.getURI().getPath();
        if (path.endsWith("/pdf")) {
            return body;
        }

        if (body instanceof String texto) {
            try {
                return objectMapper.writeValueAsString(ApiResponse.of(status, defaultMessage(status), texto));
            } catch (JsonProcessingException exception) {
                throw new RuntimeException("Erro ao serializar resposta da API.", exception);
            }
        }

        return ApiResponse.of(status, defaultMessage(status), body);
    }

    private String defaultMessage(int status) {
        if (status >= 200 && status < 300) {
            return "Operação realizada com sucesso.";
        }

        if (status >= 400 && status < 500) {
            return "Erro na requisição.";
        }

        if (status >= 500) {
            return "Erro interno no servidor.";
        }

        return "Resposta processada.";
    }
}

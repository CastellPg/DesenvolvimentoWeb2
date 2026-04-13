package com.trabalhow2.backend.exception;

import java.net.URI;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.trabalhow2.backend.controller.response.ErrorMessage;

import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@ControllerAdvice
public class ExceptionMapper {

    @ExceptionHandler(LoginErrorException.class)
    public ResponseEntity<ErrorMessage> loginErrorException(LoginErrorException exception) {
        ErrorMessage errorMessage = new ErrorMessage();
        errorMessage.setMessage(exception.getMessage());
        log.error("{}", errorMessage);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorMessage);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorMessage> illegalArgumentException(IllegalArgumentException exception) {
        ErrorMessage errorMessage = new ErrorMessage();
        errorMessage.setMessage(exception.getMessage());
        log.error("{}", errorMessage);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorMessage);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorMessage> methodArgumentNotValidException(MethodArgumentNotValidException exception) {
        String mensagem = exception.getBindingResult()
                .getFieldErrors()
                .stream()
                .findFirst()
                .map(erro -> erro.getDefaultMessage())
                .orElse("Dados inválidos.");

        ErrorMessage errorMessage = new ErrorMessage();
        errorMessage.setMessage(mensagem);
        log.error("{}", errorMessage);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorMessage);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorMessage> runtimeException(RuntimeException exception) {
        ErrorMessage errorMessage = new ErrorMessage();
        errorMessage.setMessage(exception.getMessage());
        log.error("{}", errorMessage);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorMessage);
    }


    // falha de Bean Validation 
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ProblemDetail handleValidationErrors(MethodArgumentNotValidException ex, HttpServletRequest request) {
        // aqui vai agrupar os erros por campo para facilitar o consumo no Angular
        Map<String, String> erros = ex.getBindingResult().getFieldErrors().stream()
                .collect(Collectors.toMap(FieldError::getField, FieldError::getDefaultMessage,
                        (existente, novo) -> existente));

        ProblemDetail pd = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, "Dados de entrada inválidos.");
        pd.setTitle("Erro de validação");
        pd.setInstance(URI.create(request.getRequestURI()));
        pd.setProperty("erros", erros);
        return pd;
    }
}

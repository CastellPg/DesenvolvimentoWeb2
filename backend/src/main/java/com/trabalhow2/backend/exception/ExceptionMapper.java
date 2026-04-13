package com.trabalhow2.backend.exception;

import com.trabalhow2.backend.controller.response.ErrorMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

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


}

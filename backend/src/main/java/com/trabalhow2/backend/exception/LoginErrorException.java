package com.trabalhow2.backend.exception;

public class LoginErrorException extends RuntimeException {
  public LoginErrorException() {
    super("E-mail ou senha inválidos");
  }

  public LoginErrorException(String message) {
    super(message);
  }
}

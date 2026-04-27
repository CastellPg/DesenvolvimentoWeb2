package com.trabalhow2.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync; 
import org.springframework.retry.annotation.EnableRetry; 

@SpringBootApplication
@EnableAsync // Envia email em segundo plano
@EnableRetry // Ajuda a tentar enviar o email de novo se falhar
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

}

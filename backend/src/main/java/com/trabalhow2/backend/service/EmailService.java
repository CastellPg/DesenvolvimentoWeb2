package com.trabalhow2.backend.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    private final JavaMailSender emailSender;

    @Autowired
    public EmailService(JavaMailSender emailSender) {
        this.emailSender = emailSender;
    }

    public void sendWelcomeEmail(String to, String nome, String senhaTemporaria) {
        try {
            MimeMessage message = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, "UTF-8");

            helper.setTo(to);
            helper.setSubject("Bem-vindo(a) ao sistema");

            String html = """
                <html>
                    <body style="font-family: Arial, sans-serif; color: #333;">
                        <h2>Olá, %s!</h2>
                        <p>Seu cadastro foi realizado com sucesso.</p>
                        <p><strong>Sua senha temporária é:</strong> %s</p>
                        <p>Use esse e-mail e essa senha para fazer login no sistema.</p>
                        <p>Atenciosamente,<br>Equipe de suporte</p>
                    </body>
                </html>
                """.formatted(nome, senhaTemporaria);

            helper.setText(html, true);
            emailSender.send(message);

        } catch (MessagingException | MailException e) {
            throw new RuntimeException("Erro ao enviar e-mail de boas-vindas.", e);
        }
    }
}
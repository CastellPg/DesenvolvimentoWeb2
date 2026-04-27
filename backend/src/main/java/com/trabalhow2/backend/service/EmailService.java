package com.trabalhow2.backend.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import com.trabalhow2.backend.model.MudancaEstadoEvent;
import org.springframework.context.event.EventListener;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.scheduling.annotation.Async;

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

        @Async
        @EventListener
        @Retryable (
            retryFor = RuntimeException.class,
            maxAttempts = 3,
            backoff = @Backoff(delay = 5000)
        )

        public void notificarClienteMudancaEstado(MudancaEstadoEvent event) {
        String emailDestino = event.solicitacao().getCliente().getUsuario().getEmail();
        String nomeCliente = event.solicitacao().getCliente().getUsuario().getNome();
        String equipamento = event.solicitacao().getDescricaoEquipamento();

        try {
            MimeMessage message = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(emailDestino);
            helper.setSubject("Atualização na Solicitação: " + equipamento);

            String html = """
                <html>
                    <body style="font-family: Arial, sans-serif; color: #333;">
                        <h2>Olá, %s!</h2>
                        <p>A sua solicitação para o equipamento <strong>%s</strong> teve o status atualizado.</p>
                        <div style="background-color: #f4f4f4; padding: 15px; border-radius: 5px; margin: 20px 0;">
                            <p>Status Anterior: <span style="color: #666;">%s</span></p>
                            <p>Novo Status: <strong style="color: #0056b3;">%s</strong></p>
                        </div>
                        <p>Acesse o sistema para mais detalhes.</p>
                        <p>Atenciosamente,<br>Equipe TecMaint</p>
                    </body>
                </html>
                """.formatted(nomeCliente, equipamento, event.estadoAnterior(), event.estadoNovo());

            helper.setText(html, true);
            emailSender.send(message);

            System.out.println("Email enviado com sucesso para: " + emailDestino);

        } catch (MessagingException | MailException e) {
            System.err.println("Falha ao enviar email para " + emailDestino + ". O Spring tentará novamente.");
            throw new RuntimeException("Erro ao enviar e-mail de atualização.", e);
        }


        
    }
}
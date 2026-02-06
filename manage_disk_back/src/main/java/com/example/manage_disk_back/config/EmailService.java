package com.example.manage_disk_back.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public boolean sendEmail(String from, String to, String subject, String text) {
        try {
            String cleanedText = text.replace("\r", "").trim();
            String html = cleanedText.replace("\n", "<br>");

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setFrom(from);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(cleanedText, html); // Plain text + HTML

            mailSender.send(message);

            System.out.println("Email envoyé !");
            return true;
        } catch (jakarta.mail.MessagingException | org.springframework.mail.MailException e) {
            //e.printStackTrace();
            System.err.println("Erreur email : " + e.getMessage());
            return false;
        }
    }
    
}

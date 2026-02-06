package com.example.manage_disk_back.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.manage_disk_back.config.EmailService;

@RestController
public class NotificationController {

    @Autowired
    private EmailService emailService;

    @PostMapping("/sendEmail")
    public ResponseEntity<?> send(
            @RequestParam String from,
            @RequestParam String to,
            @RequestParam String subject,
            @RequestParam String text) {

        emailService.sendEmail(from, to, subject, text);
        return ResponseEntity.ok("Email envoyé !");
    }
}

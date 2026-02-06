package com.example.manage_disk_back.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.data.jpa.repository.JpaRepository;


import com.example.manage_disk_back.dto.LoginResponse;
import com.example.manage_disk_back.model.Utilisateur;
import com.example.manage_disk_back.repository.UtilisateurRepository;

@Service
public class AuthService {

    private final PasswordEncoder passwordEncoder;
    private final UtilisateurRepository utilisateurRepository;

    public AuthService(PasswordEncoder passwordEncoder,
                       UtilisateurRepository utilisateurRepository) {
        this.passwordEncoder = passwordEncoder;
        this.utilisateurRepository = utilisateurRepository;
    }

    public LoginResponse authenticate(String email, String password) {

        Utilisateur user = utilisateurRepository.findByEmail(email).orElse(null);

        if (user == null) {
            return new LoginResponse(false, "Email introuvable", null);
        }

        if (!passwordEncoder.matches(password, user.getPasswordCrypted())) {
            return new LoginResponse(false, "Mot de passe incorrect", null);
        }

        return new LoginResponse(true, "Connexion réussie", user.getId());
    }
}

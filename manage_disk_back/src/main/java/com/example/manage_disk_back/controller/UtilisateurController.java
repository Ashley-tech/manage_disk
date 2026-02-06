package com.example.manage_disk_back.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.manage_disk_back.config.AuthService;
import com.example.manage_disk_back.dto.LoginRequest;
import com.example.manage_disk_back.dto.LoginResponse;
import com.example.manage_disk_back.dto.NouveauUtilisateurRequest;
import com.example.manage_disk_back.model.Utilisateur;
import com.example.manage_disk_back.repository.UtilisateurRepository;

@RestController
@RequestMapping("/utilisateurs")
public class UtilisateurController {

    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthService authService;

    public UtilisateurController(UtilisateurRepository utilisateurRepository,
                                 PasswordEncoder passwordEncoder,
                                 AuthService authService) {
        this.utilisateurRepository = utilisateurRepository;
        this.passwordEncoder = passwordEncoder;
        this.authService = authService;
    }

    @GetMapping
    public List<Utilisateur> getAll() {
        return utilisateurRepository.findAllByOrderByEmailAsc();
    }

    @PostMapping
    public ResponseEntity<?> createUtilisateur(@RequestBody NouveauUtilisateurRequest request) {

        // Vérification e-mail déjà existant
        if (utilisateurRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email déjà utilisé.");
        }

        Utilisateur user = new Utilisateur();
        user.setNom(request.getNom());
        user.setPrenom(request.getPrenom());
        user.setEmail(request.getEmail());

        // Version claire (tu l'as demandé)
        user.setPassword(request.getPassword());

        // Version cryptée
        user.setPasswordCrypted(passwordEncoder.encode(request.getPassword()));

        utilisateurRepository.save(user);

        return ResponseEntity.ok(user);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Utilisateur> updateUtilisateur(
            @PathVariable Long id,
            @RequestBody Utilisateur userDetails) {

        return utilisateurRepository.findById(id)
                .map(user -> {
                    user.setNom(userDetails.getNom());
                    user.setPrenom(userDetails.getPrenom());
                    user.setEmail(userDetails.getEmail());
                    // facultatif : mettre à jour mot de passe si fourni
                    user.setPassword(userDetails.getPassword());
                    user.setPasswordCrypted(passwordEncoder.encode(userDetails.getPassword()));
                    return ResponseEntity.ok(utilisateurRepository.save(user));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/forgot-password")
    public ResponseEntity<Utilisateur> changePassword(
            @PathVariable Long id,
            @RequestBody Utilisateur userDetails) {

        return utilisateurRepository.findById(id)
                .map(user -> {
                    user.setPassword(userDetails.getPassword());
                    user.setPasswordCrypted(passwordEncoder.encode(userDetails.getPassword()));
                    return ResponseEntity.ok(utilisateurRepository.save(user));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUtilisateur(@PathVariable Long id) {

        if (!utilisateurRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        utilisateurRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        return authService.authenticate(request.email, request.password);
    }


}

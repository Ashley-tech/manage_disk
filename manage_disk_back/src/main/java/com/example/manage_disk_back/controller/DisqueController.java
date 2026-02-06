package com.example.manage_disk_back.controller;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.manage_disk_back.dto.CreateDisqueRequest;
import com.example.manage_disk_back.dto.OperationRequest;
import com.example.manage_disk_back.model.Disque;
import com.example.manage_disk_back.model.Utilisateur;
import com.example.manage_disk_back.repository.DisqueRepository;
import com.example.manage_disk_back.repository.UtilisateurRepository;

@RestController
@RequestMapping("/disques")
@CrossOrigin("*")
public class DisqueController {

    private final DisqueRepository disqueRepository;
    private final UtilisateurRepository utilisateurRepository;

    public DisqueController(DisqueRepository disqueRepository, UtilisateurRepository utilisateurRepository) {
        this.disqueRepository = disqueRepository;
        this.utilisateurRepository = utilisateurRepository;
    }

    @GetMapping
    public List<Disque> getAll() {
        return disqueRepository.findAllByOrderByNomAsc();
    }

    @PostMapping("/{id}/operations")
    public ResponseEntity<?> applyOperation(
            @PathVariable Long id,
            @RequestBody OperationRequest request
    ) {
        Disque disque = disqueRepository.findById(id)
                .orElse(null);

        if (disque == null) {
            return ResponseEntity.status(404).body("Disque introuvable.");
        }

        BigDecimal valeur = request.getValeur();
        String type = request.getType();

        if (valeur.compareTo(BigDecimal.ZERO) <= 0) {
            return ResponseEntity.badRequest().body("La valeur doit être positive.");
        }

        BigDecimal espaceRestant = disque.getEspaceRestant();

        switch (type.toLowerCase()) {
            case "remove" -> {
                // regagner de l’espace → on retire de l’imaginaire
                if (espaceRestant.subtract(valeur).compareTo(BigDecimal.ZERO) < 0) {
                    return ResponseEntity.badRequest().body("Impossible : l’espace imaginaire deviendrait négatif.");
                }
                disque.setEspaceRestant(espaceRestant.subtract(valeur));
            }

            case "add" -> // perdre de l’espace → on augmente l’imaginaire
                disque.setEspaceRestant(espaceRestant.add(valeur));

            default -> {
                return ResponseEntity.badRequest().body("Type d'opération invalide. Utilise 'add' ou 'remove'.");
            }
        }

        disqueRepository.save(disque);

        return ResponseEntity.ok(disque);
    }

    @PostMapping
    public ResponseEntity<?> createDisque(@RequestBody CreateDisqueRequest request) {

        // récupérer l'utilisateur
        Utilisateur user = utilisateurRepository.findById(request.getUtilisateurId())
                .orElse(null);

        if (user == null) {
            return ResponseEntity.status(404).body("Utilisateur introuvable.");
        }

        // créer le disque
        Disque disque = new Disque();
        disque.setNom(request.getNom());
        disque.setEspaceRestant(request.getEspaceRestant());
        disque.setUtilisateur(user);

        disqueRepository.save(disque);

        return ResponseEntity.ok(disque);
    }

    @GetMapping("/utilisateurs/{id}/disques")
    public ResponseEntity<?> getDisquesByUtilisateur(@PathVariable Long id) {

        // vérifier que l'utilisateur existe
        Utilisateur user = utilisateurRepository.findById(id).orElse(null);

        if (user == null) {
            return ResponseEntity.status(404).body("Utilisateur introuvable.");
        }

        List<Disque> disques = disqueRepository.findByUtilisateurIdOrderByNomAsc(id);

        return ResponseEntity.ok(disques);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Disque> updateDisque(
            @PathVariable Long id,
            @RequestBody Disque disqueDetails) {

        Optional<Disque> disqueOpt = disqueRepository.findById(id);
        if (disqueOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Disque disque = disqueOpt.get();
        disque.setNom(disqueDetails.getNom());
        disque.setEspaceRestant(disqueDetails.getEspaceRestant());

        Disque updatedDisque = disqueRepository.save(disque);
        return ResponseEntity.ok(updatedDisque);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDisque(@PathVariable Long id) {

        if (!disqueRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        disqueRepository.deleteById(id);
        return ResponseEntity.noContent().build(); 
    }

}

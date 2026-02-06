package com.example.manage_disk_back.dto;
import java.math.BigDecimal;

public class CreateDisqueRequest {

    private String nom;
    private BigDecimal espaceRestant;
    private Long utilisateurId;

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public BigDecimal getEspaceRestant() {
        return espaceRestant;
    }

    public void setEspaceRestant(BigDecimal espaceRestant) {
        this.espaceRestant = espaceRestant;
    }

    public Long getUtilisateurId() {
        return utilisateurId;
    }

    public void setUtilisateurId(Long utilisateurId) {
        this.utilisateurId = utilisateurId;
    }
}

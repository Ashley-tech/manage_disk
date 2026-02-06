package com.example.manage_disk_back.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "utilisateur")
public class Utilisateur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    private String prenom;
    private String email;
    private String password;         // version non cryptée (comme tu veux)
    private String passwordCrypted;  // version hashée

    @OneToMany(mappedBy = "utilisateur")
    @JsonIgnore
    private List<Disque> disques;

    // getters & setters
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getNom() {
        return nom;
    }
    public void setNom(String nom) {
        this.nom = nom;
    }
    public String getPrenom() {
        return prenom;
    }
    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
    public List<Disque> getDisques() {
        return disques;
    }
    public void setDisques(List<Disque> disques) {
        this.disques = disques;
    }

    public String getPasswordCrypted() {
        return passwordCrypted;
    }

    public void setPasswordCrypted(String passwordCrypted) {
        this.passwordCrypted = passwordCrypted;
    }
}

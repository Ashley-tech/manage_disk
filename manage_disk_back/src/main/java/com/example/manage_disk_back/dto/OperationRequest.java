package com.example.manage_disk_back.dto;

import java.math.BigDecimal;

public class OperationRequest {
    private String type;
    private BigDecimal valeur;

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public BigDecimal getValeur() {
        return valeur;
    }

    public void setValeur(BigDecimal valeur) {
        this.valeur = valeur;
    }
}

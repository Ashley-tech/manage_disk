package com.example.manage_disk_back.dto;

public class LoginResponse {
    public boolean success;
    public String message;
    public Long userId;

    public LoginResponse(boolean success, String message, Long userId) {
        this.success = success;
        this.message = message;
        this.userId = userId;
    }
}

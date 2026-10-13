package com.example.demo.Object;

public class LoginResponse {
    // Renamed 'success' to 'status' to match your other code
    private boolean status; 
    private String message;
    private SignupDTO user;

    public LoginResponse(boolean status, String message, SignupDTO user) {
        this.status = status;
        this.message = message;
        this.user = user;
    }

    // UserController needs this specific method name:
    public boolean isSuccess() { 
        return status; 
    }

    public boolean isStatus() { return status; }
    public void setStatus(boolean status) { this.status = status; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public SignupDTO getUser() { return user; }
    public void setUser(SignupDTO user) { this.user = user; }
}
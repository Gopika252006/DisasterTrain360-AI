package com.disastertrain360.dto;

public class LoginResponse {
    private String token;
    private String role;
    private String name;
    private String email;

    public LoginResponse() {}

    public LoginResponse(String token, String role, String name, String email) {
        this.token = token;
        this.role = role;
        this.name = name;
        this.email = email;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final LoginResponse obj = new LoginResponse();

        public Builder token(String v) { obj.token = v; return this; }
        public Builder role(String v) { obj.role = v; return this; }
        public Builder name(String v) { obj.name = v; return this; }
        public Builder email(String v) { obj.email = v; return this; }

        public LoginResponse build() { return obj; }
    }
}

package com.disastertrain360.model;

public class User {
    private String userId;
    private String name;
    private String email;
    private String password;
    private UserRole role;
    private String department;
    private String createdAt;

    public User() {}

    public User(String userId, String name, String email, String password,
                UserRole role, String department, String createdAt) {
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.department = department;
        this.createdAt = createdAt;
    }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public UserRole getRole() { return role; }
    public void setRole(UserRole role) { this.role = role; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final User obj = new User();

        public Builder userId(String v) { obj.userId = v; return this; }
        public Builder name(String v) { obj.name = v; return this; }
        public Builder email(String v) { obj.email = v; return this; }
        public Builder password(String v) { obj.password = v; return this; }
        public Builder role(UserRole v) { obj.role = v; return this; }
        public Builder department(String v) { obj.department = v; return this; }
        public Builder createdAt(String v) { obj.createdAt = v; return this; }

        public User build() { return obj; }
    }
}

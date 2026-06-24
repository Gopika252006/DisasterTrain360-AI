package com.disastertrain360.service;

import com.disastertrain360.dto.LoginRequest;
import com.disastertrain360.dto.LoginResponse;
import com.disastertrain360.dto.RegisterRequest;
import com.disastertrain360.model.User;
import com.disastertrain360.model.UserRole;
import com.disastertrain360.repository.InMemoryStore;
import com.disastertrain360.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import java.util.UUID;

@Service
public class AuthService {

    private final InMemoryStore store;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    public AuthService(InMemoryStore store, JwtUtil jwtUtil, PasswordEncoder passwordEncoder) {
        this.store = store;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    public LoginResponse login(LoginRequest req) {
        User user = store.findUserByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name(), user.getName());
        return LoginResponse.builder()
                .token(token)
                .role(user.getRole().name())
                .name(user.getName())
                .email(user.getEmail())
                .build();
    }

    public Map<String, String> register(RegisterRequest req) {
        if (store.existsByEmail(req.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        UserRole role;
        try {
            role = UserRole.valueOf(req.getRole().toUpperCase().replace(" ", "_").replace("-", "_"));
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid role: " + req.getRole());
        }

        if (role == UserRole.NDMA_ADMIN) {
            throw new RuntimeException("NDMA Admin accounts cannot be self-registered");
        }

        User user = User.builder()
                .userId(UUID.randomUUID().toString())
                .name(req.getName())
                .email(req.getEmail().toLowerCase())
                .password(passwordEncoder.encode(req.getPassword()))
                .role(role)
                .department(role == UserRole.TRAINING_PROVIDER ? "Training Provider" : "Public")
                .createdAt(LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME))
                .build();

        store.saveUser(user);
        return Map.of("message", "User Registered Successfully");
    }
}

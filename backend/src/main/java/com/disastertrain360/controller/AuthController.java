package com.disastertrain360.controller;

import com.disastertrain360.dto.ApiResponse;
import com.disastertrain360.dto.LoginRequest;
import com.disastertrain360.dto.LoginResponse;
import com.disastertrain360.dto.RegisterRequest;
import com.disastertrain360.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@Tag(name = "Authentication", description = "Login and Registration APIs")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    @Operation(summary = "Login user", description = "Returns JWT token with role and name")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest req) {
        return ResponseEntity.ok(authService.login(req));
    }

    @PostMapping("/register")
    @Operation(summary = "Register new user", description = "Registers PUBLIC_USER or TRAINING_PROVIDER")
    public ResponseEntity<Map<String, String>> register(@Valid @RequestBody RegisterRequest req) {
        return ResponseEntity.ok(authService.register(req));
    }
}

package com.disastertrain360.controller;

import com.disastertrain360.model.Notification;
import com.disastertrain360.repository.DynamoDbRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/notifications")
@Tag(name = "Notifications", description = "System notifications API")
public class NotificationController {

    private final DynamoDbRepository repo;

    public NotificationController(DynamoDbRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    @Operation(summary = "Get all system notifications")
    public ResponseEntity<List<Notification>> getAll() {
        return ResponseEntity.ok(repo.allNotifications());
    }
}

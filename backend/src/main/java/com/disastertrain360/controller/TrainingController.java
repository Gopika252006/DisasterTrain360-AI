package com.disastertrain360.controller;

import com.disastertrain360.dto.ApiResponse;
import com.disastertrain360.dto.TrainingRequest;
import com.disastertrain360.model.Training;
import com.disastertrain360.service.TrainingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/training")
@Tag(name = "Training", description = "Training management APIs")
@SecurityRequirement(name = "bearerAuth")
public class TrainingController {

    private final TrainingService trainingService;

    public TrainingController(TrainingService trainingService) {
        this.trainingService = trainingService;
    }

    @PostMapping
    @Operation(summary = "Create a new training program")
    public ResponseEntity<Training> createTraining(
            @Valid @RequestBody TrainingRequest req,
            Authentication auth) {
        String createdBy = auth != null ? auth.getName() : "system";
        return ResponseEntity.ok(trainingService.createTraining(req, createdBy));
    }

    @GetMapping
    @Operation(summary = "Get all trainings", description = "Supports filtering by state, district, status")
    public ResponseEntity<List<Training>> getAllTrainings(
            @RequestParam(required = false) String state,
            @RequestParam(required = false) String district,
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(trainingService.getAllTrainings(state, district, status));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get training by ID")
    public ResponseEntity<Training> getById(@PathVariable String id) {
        return trainingService.getTrainingById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}

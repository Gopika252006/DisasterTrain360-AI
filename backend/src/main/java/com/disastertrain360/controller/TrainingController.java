package com.disastertrain360.controller;

import com.disastertrain360.aws.S3Service;
import com.disastertrain360.dto.ApiResponse;
import com.disastertrain360.dto.TrainingRequest;
import com.disastertrain360.model.Training;
import com.disastertrain360.service.TrainingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/training")
@Tag(name = "Training", description = "Training management APIs")
@SecurityRequirement(name = "bearerAuth")
public class TrainingController {

    private final TrainingService trainingService;
    private final S3Service s3Service;

    public TrainingController(TrainingService trainingService, S3Service s3Service) {
        this.trainingService = trainingService;
        this.s3Service = s3Service;
    }

    /** POST /training/upload-photo  → uploads photo to S3, returns {photoUrl} */
    @PostMapping(value = "/upload-photo", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload training photo to S3, returns URL")
    public ResponseEntity<?> uploadPhoto(
            @RequestParam("photo") MultipartFile photo,
            @RequestParam(value = "trainingId", required = false) String trainingId) {
        try {
            String tid = (trainingId != null && !trainingId.isBlank())
                    ? trainingId : "tmp-" + UUID.randomUUID();
            String url = s3Service.uploadTrainingPhoto(tid, photo);
            return ResponseEntity.ok(Map.of("photoUrl", url));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("message", "Photo upload failed: " + e.getMessage()));
        }
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

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing training program")
    public ResponseEntity<Training> updateTraining(
            @PathVariable String id,
            @RequestBody TrainingRequest req,
            Authentication auth) {
        return trainingService.updateTraining(id, req)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/complete")
    @Operation(summary = "Admin: Mark training as Completed")
    public ResponseEntity<?> completeTraining(
            @PathVariable String id,
            Authentication auth) {
        return trainingService.markCompleted(id)
                .map(t -> ResponseEntity.ok()
                        .<Object>body(Map.of(
                                "message", "Training marked as Completed",
                                "trainingId", id,
                                "status", "COMPLETED"
                        )))
                .orElse(ResponseEntity.notFound().<Object>build());
    }

    /** GET /training/my — returns only trainings created by the logged-in provider */
    @GetMapping("/my")
    @Operation(summary = "Get trainings created by the authenticated provider")
    public ResponseEntity<List<Training>> getMyTrainings(Authentication auth) {
        if (auth == null) return ResponseEntity.status(401).build();
        String email = auth.getName();
        List<Training> mine = trainingService.getAllTrainings(null, null, null)
                .stream()
                .filter(t -> email.equalsIgnoreCase(t.getCreatedBy()))
                .toList();
        return ResponseEntity.ok(mine);
    }
}

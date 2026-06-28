package com.disastertrain360.controller;

import com.disastertrain360.aws.S3Service;
import com.disastertrain360.model.Enrollment;
import com.disastertrain360.repository.DynamoDbRepository;
import com.disastertrain360.service.EnrollmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/enrollment")
@Tag(name = "Enrollment", description = "Training enrollment and certificates APIs")
@SecurityRequirement(name = "bearerAuth")
public class EnrollmentController {

    private final EnrollmentService  enrollmentService;
    private final DynamoDbRepository repo;
    private final S3Service          s3Service;

    public EnrollmentController(EnrollmentService enrollmentService,
                                DynamoDbRepository repo,
                                S3Service s3Service) {
        this.enrollmentService = enrollmentService;
        this.repo              = repo;
        this.s3Service         = s3Service;
    }

    /** POST /enrollment/{trainingId} — enroll authenticated user */
    @PostMapping("/{trainingId}")
    @Operation(summary = "Enroll in a training")
    public ResponseEntity<?> enroll(@PathVariable String trainingId, Authentication auth) {
        if (auth == null) return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        try {
            String email = auth.getName();
            String name  = repo.findUserByEmail(email)
                    .map(u -> u.getName())
                    .orElse(email);
            return ResponseEntity.ok(enrollmentService.enroll(trainingId, email, name));
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(Map.of("message", ex.getMessage()));
        }
    }

    /**
     * GET /enrollment/all — Admin: get every enrollment across all trainings
     */
    @GetMapping("/all")
    @Operation(summary = "Admin: Get all enrollments")
    public ResponseEntity<List<Enrollment>> getAllEnrollments(Authentication auth) {
        if (auth == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(enrollmentService.getAllEnrollments());
    }

    /** GET /enrollment/my — all enrollments for authenticated user */
    @GetMapping("/my")
    @Operation(summary = "Get my registrations")
    public ResponseEntity<List<Enrollment>> getMyEnrollments(Authentication auth) {
        if (auth == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(enrollmentService.getMyEnrollments(auth.getName()));
    }

    /** GET /enrollment/certificates — completed trainings only */
    @GetMapping("/certificates")
    @Operation(summary = "Get my certificates")
    public ResponseEntity<List<Enrollment>> getCertificates(Authentication auth) {
        if (auth == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(enrollmentService.getMyCertificates(auth.getName()));
    }

    /** GET /enrollment/check/{trainingId} — already enrolled? */
    @GetMapping("/check/{trainingId}")
    @Operation(summary = "Check enrollment status for a training")
    public ResponseEntity<Map<String, String>> checkEnrollment(
            @PathVariable String trainingId, Authentication auth) {
        if (auth == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(enrollmentService.checkEnrollment(trainingId, auth.getName()));
    }

    /**
     * PUT /enrollment/{enrollmentId}/approve
     * Admin only — marks enrollment as COMPLETED and marks the training as COMPLETED.
     */
    @PutMapping("/{enrollmentId}/approve")
    @Operation(summary = "Admin: Approve enrollment after evidence review")
    public ResponseEntity<?> approveEnrollment(
            @PathVariable String enrollmentId,
            Authentication auth) {
        if (auth == null) return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));

        return repo.findEnrollmentById(enrollmentId)
                .map(enrollment -> {
                    // 1. Mark enrollment COMPLETED
                    enrollment.setStatus("COMPLETED");
                    repo.saveEnrollment(enrollment);

                    // 2. Mark the training itself as COMPLETED
                    repo.findTrainingById(enrollment.getTrainingId()).ifPresent(training -> {
                        training.setStatus("COMPLETED");
                        repo.saveTraining(training);
                    });

                    return ResponseEntity.ok()
                            .<Object>body(Map.of(
                                    "message", "Enrollment approved and training marked as Completed",
                                    "enrollmentId", enrollmentId,
                                    "trainingId", enrollment.getTrainingId(),
                                    "status", "COMPLETED"
                            ));
                })
                .orElse(ResponseEntity.notFound().<Object>build());
    }

    /**
     * PUT /enrollment/training/{trainingId}/approve
     * Admin only — directly approve a training by ID (used when trainer uploads evidence
     * without an enrollment record, i.e. TRAINING_PROVIDER flow).
     */
    @PutMapping("/training/{trainingId}/approve")
    @Operation(summary = "Admin: Approve training evidence and mark training as Completed")
    public ResponseEntity<?> approveTraining(
            @PathVariable String trainingId,
            Authentication auth) {
        if (auth == null) return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));

        return repo.findTrainingById(trainingId)
                .map(training -> {
                    training.setStatus("COMPLETED");
                    repo.saveTraining(training);
                    return ResponseEntity.ok()
                            .<Object>body(Map.of(
                                    "message", "Training evidence approved — training marked as Completed",
                                    "trainingId", trainingId,
                                    "status", "COMPLETED"
                            ));
                })
                .orElse(ResponseEntity.notFound().<Object>build());
    }

    /**
     * GET /enrollment/training/{trainingId}
     * Admin — view all enrollments for a training (to review evidence).
     */
    @GetMapping("/training/{trainingId}")
    @Operation(summary = "Admin: Get all enrollments for a training")
    public ResponseEntity<List<Enrollment>> getEnrollmentsByTraining(
            @PathVariable String trainingId,
            Authentication auth) {
        if (auth == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(enrollmentService.getEnrollmentsByTraining(trainingId));
    }
    @GetMapping("/certificates/{enrollmentId}/download")
    @Operation(summary = "Get presigned download URL for a certificate")
    public ResponseEntity<?> downloadCertificate(
            @PathVariable String enrollmentId, Authentication auth) {
        if (auth == null) return ResponseEntity.status(401).build();

        List<Enrollment> certs = enrollmentService.getMyCertificates(auth.getName());
        return certs.stream()
                .filter(e -> e.getEnrollmentId().equals(enrollmentId))
                .findFirst()
                .map(e -> {
                    // certificateUrl field holds the S3 URL if a PDF was uploaded
                    // For now return a message — cert generation can be added later
                    return ResponseEntity.ok()
                            .<Object>body(Map.of(
                                    "enrollmentId",  e.getEnrollmentId(),
                                    "trainingName",  e.getTrainingName(),
                                    "status",        "Certificate generation not yet configured",
                                    "message",       "Upload certificate PDF via POST /evidence to enable download"
                            ));
                })
                .orElse(ResponseEntity.notFound().<Object>build());
    }
}

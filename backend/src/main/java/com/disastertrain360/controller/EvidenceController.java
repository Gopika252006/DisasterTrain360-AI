package com.disastertrain360.controller;

import com.disastertrain360.service.EvidenceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/evidence")
@Tag(name = "Evidence", description = "Training evidence upload API")
@SecurityRequirement(name = "bearerAuth")
public class EvidenceController {

    private final EvidenceService evidenceService;

    public EvidenceController(EvidenceService evidenceService) {
        this.evidenceService = evidenceService;
    }

    /**
     * POST /evidence
     * Accepts multipart form: trainingId, evidenceType, notes, files[]
     */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload training evidence files to S3")
    public ResponseEntity<?> upload(
            @RequestParam("trainingId")   String trainingId,
            @RequestParam("evidenceType") String evidenceType,
            @RequestParam(value = "notes", required = false, defaultValue = "") String notes,
            @RequestParam("files") List<MultipartFile> files,
            Authentication auth) {

        String uploader = auth != null ? auth.getName() : "anonymous";

        try {
            List<String> presignedUrls = evidenceService.uploadEvidence(trainingId, evidenceType, uploader, files);
            return ResponseEntity.ok(Map.of(
                    "message",       "Evidence uploaded successfully. Pending admin approval.",
                    "filesUploaded", presignedUrls.size(),
                    "urls",          presignedUrls
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("message", "Upload failed: " + e.getMessage()));
        }
    }

    /**
     * GET /evidence/presigned?key={s3Key}
     * Generate a fresh 60-minute presigned URL for any stored S3 key or URL.
     * Used by the admin Evidence Review page to view uploaded files.
     */
    @GetMapping("/presigned")
    @Operation(summary = "Get a presigned S3 URL for viewing an evidence file")
    public ResponseEntity<?> presigned(@RequestParam("key") String key, Authentication auth) {
        if (auth == null) return ResponseEntity.status(401).build();
        try {
            String url = evidenceService.getPresignedUrl(key);
            return ResponseEntity.ok(Map.of("url", url));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("message", "Could not generate presigned URL: " + e.getMessage()));
        }
    }
}

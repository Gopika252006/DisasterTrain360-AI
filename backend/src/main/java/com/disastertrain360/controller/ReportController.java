package com.disastertrain360.controller;

import com.disastertrain360.aws.S3Service;
import com.disastertrain360.model.Report;
import com.disastertrain360.repository.DynamoDbRepository;
import com.disastertrain360.service.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@Tag(name = "Reports", description = "Intelligence reports API")
@SecurityRequirement(name = "bearerAuth")
public class ReportController {

    private final ReportService       reportService;
    private final S3Service           s3Service;
    private final DynamoDbRepository  repo;

    public ReportController(ReportService reportService, S3Service s3Service,
                            DynamoDbRepository repo) {
        this.reportService = reportService;
        this.s3Service     = s3Service;
        this.repo          = repo;
    }

    /** GET /reports — list all reports */
    @GetMapping("/reports")
    @PreAuthorize("hasRole('NDMA_ADMIN')")
    @Operation(summary = "Get all intelligence reports")
    public ResponseEntity<List<Report>> getReports() {
        return ResponseEntity.ok(reportService.getAllReports());
    }

    /**
     * POST /reports/upload — upload a report PDF to S3, save metadata to DynamoDB.
     * Form fields: file (multipart), reportName, type, description
     */
    @PostMapping(value = "/reports/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('NDMA_ADMIN')")
    @Operation(summary = "Upload a report PDF to S3 and register in DynamoDB")
    public ResponseEntity<?> uploadReport(
            @RequestParam("file")        MultipartFile file,
            @RequestParam("reportName")  String reportName,
            @RequestParam("type")        String type,
            @RequestParam(value = "description", required = false, defaultValue = "") String description,
            Authentication auth) {
        try {
            String reportId  = UUID.randomUUID().toString();
            String reportUrl = s3Service.uploadReport(reportId, file);

            long   sizeKb    = file.getSize() / 1024;
            String sizeStr   = sizeKb > 1024
                    ? String.format("%.1f MB", sizeKb / 1024.0)
                    : sizeKb + " KB";

            Report report = Report.builder()
                    .reportId(reportId)
                    .reportName(reportName)
                    .type(type)
                    .generatedDate(LocalDate.now().toString())
                    .generatedBy(auth != null ? auth.getName() : "NDMA Admin")
                    .size(sizeStr)
                    .format("PDF")
                    .status("Ready")
                    .description(description)
                    .reportUrl(reportUrl)   // S3 URL saved in DynamoDB
                    .build();

            repo.saveReport(report);
            return ResponseEntity.ok(report);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("message", "Report upload failed: " + e.getMessage()));
        }
    }

    /**
     * GET /reports/{id}/download — returns a 60-min presigned S3 URL for direct download.
     */
    @GetMapping("/reports/{id}/download")
    @PreAuthorize("hasRole('NDMA_ADMIN')")
    @Operation(summary = "Get a presigned S3 download URL for a report")
    public ResponseEntity<?> downloadReport(@PathVariable String id) {
        return repo.allReports().stream()
                .filter(r -> r.getReportId().equals(id))
                .findFirst()
                .map(r -> {
                    if (r.getReportUrl() == null || r.getReportUrl().isBlank()) {
                        return ResponseEntity.ok()
                                .<Object>body(Map.of("message", "No file attached to this report"));
                    }
                    String presigned = s3Service.generatePresignedUrl(r.getReportUrl());
                    return ResponseEntity.ok().<Object>body(Map.of("downloadUrl", presigned));
                })
                .orElse(ResponseEntity.notFound().<Object>build());
    }
}

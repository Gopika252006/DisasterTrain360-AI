package com.disastertrain360.controller;

import com.disastertrain360.model.Report;
import com.disastertrain360.service.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@Tag(name = "Reports", description = "Intelligence reports API")
@SecurityRequirement(name = "bearerAuth")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/reports")
    @PreAuthorize("hasRole('NDMA_ADMIN')")
    @Operation(summary = "Get all intelligence reports")
    public ResponseEntity<List<Report>> getReports() {
        return ResponseEntity.ok(reportService.getAllReports());
    }
}

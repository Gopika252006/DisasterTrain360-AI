package com.disastertrain360.controller;

import com.disastertrain360.model.DistrictInsight;
import com.disastertrain360.service.InsightService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@Tag(name = "Insights", description = "AI district preparedness insights API")
@SecurityRequirement(name = "bearerAuth")
public class InsightController {

    private final InsightService insightService;

    public InsightController(InsightService insightService) {
        this.insightService = insightService;
    }

    @GetMapping("/insights")
    @PreAuthorize("hasRole('NDMA_ADMIN')")
    @Operation(summary = "Get AI district insights", description = "Filter by state or riskLevel")
    public ResponseEntity<List<DistrictInsight>> getInsights(
            @RequestParam(required = false) String state,
            @RequestParam(required = false) String riskLevel) {
        return ResponseEntity.ok(insightService.getAllInsights(state, riskLevel));
    }
}

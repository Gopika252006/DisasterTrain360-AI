package com.disastertrain360.controller;

import com.disastertrain360.dto.DashboardResponse;
import com.disastertrain360.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "Dashboard", description = "National intelligence dashboard API")
@SecurityRequirement(name = "bearerAuth")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

@GetMapping("/dashboard")
@Operation(summary = "Get national dashboard KPIs")
public ResponseEntity<DashboardResponse> getDashboard() {
    return ResponseEntity.ok(dashboardService.getDashboard());
}
}

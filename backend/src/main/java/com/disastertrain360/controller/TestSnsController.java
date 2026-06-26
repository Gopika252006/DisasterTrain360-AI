package com.disastertrain360.controller;

import com.disastertrain360.service.SnsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class TestSnsController {

    private final SnsService snsService;

    @GetMapping("/test-sns")
    public String testSns() {

        snsService.sendCriticalDistrictAlert(
                "Chennai",
                32,
                "HIGH"
        );

        return "SNS Alert Sent";
    }
}
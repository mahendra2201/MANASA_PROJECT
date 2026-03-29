package com.mediapulse.controller;

import com.mediapulse.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/kpis")
    public ResponseEntity<Map<String, Object>> getKpis() {
        return ResponseEntity.ok(analyticsService.getKpis());
    }

    @GetMapping("/platforms")
    public ResponseEntity<Map<String, Object>> getPlatformStats() {
        return ResponseEntity.ok(analyticsService.getPlatformStats());
    }
}

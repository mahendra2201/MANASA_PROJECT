package com.mediapulse.controller;

import com.mediapulse.service.AudienceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/audience")
@RequiredArgsConstructor
public class AudienceController {

    private final AudienceService audienceService;

    @GetMapping("/insights")
    public ResponseEntity<Map<String, Object>> getInsights() {
        return ResponseEntity.ok(audienceService.getInsights());
    }
}

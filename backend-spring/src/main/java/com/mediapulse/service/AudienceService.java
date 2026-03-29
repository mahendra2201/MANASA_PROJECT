package com.mediapulse.service;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AudienceService {

    private final JdbcTemplate jdbcTemplate;

    public Map<String, Object> getInsights() {
        List<Map<String, Object>> byAge = jdbcTemplate.queryForList(
                "SELECT age_group, SUM(engagement_count) AS total_engagement, " +
                "  ROUND(AVG(percentage),2) AS avg_pct " +
                "FROM audience_insights " +
                "GROUP BY age_group " +
                "ORDER BY age_group"
        );

        List<Map<String, Object>> byGender = jdbcTemplate.queryForList(
                "SELECT gender, SUM(engagement_count) AS total_engagement, " +
                "  ROUND(AVG(percentage),2) AS avg_pct " +
                "FROM audience_insights " +
                "GROUP BY gender"
        );

        List<Map<String, Object>> byDevice = jdbcTemplate.queryForList(
                "SELECT device_type, SUM(engagement_count) AS total_engagement, " +
                "  ROUND(AVG(percentage),2) AS avg_pct " +
                "FROM audience_insights " +
                "GROUP BY device_type"
        );

        List<Map<String, Object>> byLocation = jdbcTemplate.queryForList(
                "SELECT location, SUM(engagement_count) AS total_engagement " +
                "FROM audience_insights " +
                "GROUP BY location " +
                "ORDER BY total_engagement DESC LIMIT 10"
        );

        Map<String, Object> data = new HashMap<>();
        data.put("byAge", byAge);
        data.put("byGender", byGender);
        data.put("byDevice", byDevice);
        data.put("byLocation", byLocation);

        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("data", data);
        return result;
    }
}

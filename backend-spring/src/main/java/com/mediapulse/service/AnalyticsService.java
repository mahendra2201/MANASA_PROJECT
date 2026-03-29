package com.mediapulse.service;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final JdbcTemplate jdbcTemplate;

    public Map<String, Object> getKpis() {
        List<Map<String, Object>> rows = jdbcTemplate.queryForList(
                "SELECT k.*, p.content, p.media_type, p.posted_at, pl.name AS platform " +
                "FROM kpis k " +
                "JOIN posts p ON p.id = k.post_id " +
                "JOIN social_media_platforms pl ON pl.id = p.platform_id " +
                "ORDER BY k.recorded_at DESC"
        );

        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("data", rows);
        return result;
    }

    public Map<String, Object> getPlatformStats() {
        List<Map<String, Object>> rows = jdbcTemplate.queryForList(
                "SELECT pl.name AS platform, pl.account_name, " +
                "  COUNT(p.id) AS total_posts, " +
                "  COALESCE(SUM(k.likes),0) AS total_likes, " +
                "  COALESCE(SUM(k.shares),0) AS total_shares, " +
                "  COALESCE(SUM(k.comments),0) AS total_comments, " +
                "  COALESCE(SUM(k.impressions),0) AS total_impressions, " +
                "  COALESCE(SUM(k.reach),0) AS total_reach, " +
                "  COALESCE(ROUND(AVG(k.engagement_rate),2),0) AS avg_engagement_rate, " +
                "  COALESCE(ROUND(AVG(k.click_through_rate),2),0) AS avg_ctr " +
                "FROM social_media_platforms pl " +
                "LEFT JOIN posts p ON p.platform_id = pl.id " +
                "LEFT JOIN kpis k ON k.post_id = p.id " +
                "GROUP BY pl.id, pl.name, pl.account_name"
        );

        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("data", rows);
        return result;
    }
}

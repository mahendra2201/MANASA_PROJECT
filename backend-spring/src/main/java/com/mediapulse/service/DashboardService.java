package com.mediapulse.service;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final JdbcTemplate jdbcTemplate;

    public Map<String, Object> getSummary() {
        // Single-query stats
        Map<String, Object> stats = jdbcTemplate.queryForMap(
                "SELECT " +
                "  COUNT(DISTINCT p.id) AS total_posts, " +
                "  COUNT(DISTINCT c.id) AS total_campaigns, " +
                "  COUNT(DISTINCT pl.id) AS total_platforms, " +
                "  COALESCE(SUM(k.likes),0) AS total_likes, " +
                "  COALESCE(SUM(k.shares),0) AS total_shares, " +
                "  COALESCE(SUM(k.comments),0) AS total_comments, " +
                "  COALESCE(SUM(k.impressions),0) AS total_impressions, " +
                "  COALESCE(ROUND(AVG(k.engagement_rate),2),0) AS avg_engagement_rate " +
                "FROM posts p " +
                "LEFT JOIN campaigns c ON c.id = p.campaign_id " +
                "LEFT JOIN social_media_platforms pl ON pl.id = p.platform_id " +
                "LEFT JOIN kpis k ON k.post_id = p.id"
        );

        List<Map<String, Object>> recentPosts = jdbcTemplate.queryForList(
                "SELECT p.id, p.content, p.media_type, p.posted_at, " +
                "  pl.name AS platform, " +
                "  COALESCE(k.likes,0) AS likes, " +
                "  COALESCE(k.impressions,0) AS impressions, " +
                "  COALESCE(k.engagement_rate,0) AS engagement_rate " +
                "FROM posts p " +
                "JOIN social_media_platforms pl ON pl.id = p.platform_id " +
                "LEFT JOIN kpis k ON k.post_id = p.id " +
                "ORDER BY p.posted_at DESC LIMIT 5"
        );

        List<Map<String, Object>> topCampaigns = jdbcTemplate.queryForList(
                "SELECT c.id, c.name, c.status, " +
                "  COALESCE(SUM(k.likes+k.shares+k.comments),0) AS total_engagement, " +
                "  COALESCE(ROUND(AVG(k.engagement_rate),2),0) AS avg_engagement_rate " +
                "FROM campaigns c " +
                "LEFT JOIN posts p ON p.campaign_id = c.id " +
                "LEFT JOIN kpis k ON k.post_id = p.id " +
                "GROUP BY c.id, c.name, c.status " +
                "ORDER BY total_engagement DESC LIMIT 3"
        );

        List<Map<String, Object>> platformBreakdown = jdbcTemplate.queryForList(
                "SELECT pl.name AS platform, " +
                "  COUNT(p.id) AS post_count, " +
                "  COALESCE(SUM(k.likes),0) AS total_likes, " +
                "  COALESCE(SUM(k.impressions),0) AS total_impressions, " +
                "  COALESCE(ROUND(AVG(k.engagement_rate),2),0) AS avg_engagement_rate " +
                "FROM social_media_platforms pl " +
                "LEFT JOIN posts p ON p.platform_id = pl.id " +
                "LEFT JOIN kpis k ON k.post_id = p.id " +
                "GROUP BY pl.id, pl.name"
        );

        Map<String, Object> data = new HashMap<>(stats);
        data.put("recent_posts", recentPosts);
        data.put("top_campaigns", topCampaigns);
        data.put("platform_breakdown", platformBreakdown);

        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("data", data);
        return result;
    }
}

package com.mediapulse.service;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CampaignService {

    private final JdbcTemplate jdbcTemplate;

    public Map<String, Object> getAll() {
        List<Map<String, Object>> rows = jdbcTemplate.queryForList(
                "SELECT c.*, u.full_name AS created_by_name, " +
                "  COALESCE(SUM(k.likes+k.shares+k.comments),0) AS total_engagement, " +
                "  COUNT(DISTINCT p.id) AS post_count " +
                "FROM campaigns c " +
                "LEFT JOIN users u ON u.id = c.created_by " +
                "LEFT JOIN posts p ON p.campaign_id = c.id " +
                "LEFT JOIN kpis k ON k.post_id = p.id " +
                "GROUP BY c.id " +
                "ORDER BY c.created_at DESC"
        );

        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("data", rows);
        return result;
    }

    public Map<String, Object> getOne(Long id) {
        List<Map<String, Object>> campaigns = jdbcTemplate.queryForList(
                "SELECT * FROM campaigns WHERE id = ?", id
        );

        if (campaigns.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Campaign not found");
        }

        Map<String, Object> campaign = campaigns.get(0);

        List<Map<String, Object>> posts = jdbcTemplate.queryForList(
                "SELECT p.*, pl.name AS platform, " +
                "  k.likes, k.shares, k.comments, k.impressions, k.reach, k.engagement_rate " +
                "FROM posts p " +
                "JOIN social_media_platforms pl ON pl.id = p.platform_id " +
                "LEFT JOIN kpis k ON k.post_id = p.id " +
                "WHERE p.campaign_id = ?",
                id
        );

        Map<String, Object> data = new HashMap<>(campaign);
        data.put("posts", posts);

        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("data", data);
        return result;
    }
}

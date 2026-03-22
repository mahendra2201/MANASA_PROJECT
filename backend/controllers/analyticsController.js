const db = require('../config/db');

const getKpis = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT k.*, p.content, p.media_type, p.posted_at, pl.name AS platform
      FROM kpis k
      JOIN posts p ON p.id = k.post_id
      JOIN social_media_platforms pl ON pl.id = p.platform_id
      ORDER BY k.recorded_at DESC
    `);
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getPlatformStats = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT pl.name AS platform, pl.account_name,
        COUNT(p.id) AS total_posts,
        COALESCE(SUM(k.likes),0) AS total_likes,
        COALESCE(SUM(k.shares),0) AS total_shares,
        COALESCE(SUM(k.comments),0) AS total_comments,
        COALESCE(SUM(k.impressions),0) AS total_impressions,
        COALESCE(SUM(k.reach),0) AS total_reach,
        COALESCE(ROUND(AVG(k.engagement_rate),2),0) AS avg_engagement_rate,
        COALESCE(ROUND(AVG(k.click_through_rate),2),0) AS avg_ctr
      FROM social_media_platforms pl
      LEFT JOIN posts p ON p.platform_id = pl.id
      LEFT JOIN kpis k ON k.post_id = p.id
      GROUP BY pl.id
    `);
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getKpis, getPlatformStats };

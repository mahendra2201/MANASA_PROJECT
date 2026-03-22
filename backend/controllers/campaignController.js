const db = require('../config/db');

const getAll = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT c.*, u.full_name AS created_by_name,
        COALESCE(SUM(k.likes+k.shares+k.comments),0) AS total_engagement,
        COUNT(DISTINCT p.id) AS post_count
      FROM campaigns c
      LEFT JOIN users u ON u.id = c.created_by
      LEFT JOIN posts p ON p.campaign_id = c.id
      LEFT JOIN kpis k ON k.post_id = p.id
      GROUP BY c.id ORDER BY c.created_at DESC
    `);
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const [[campaign]] = await db.query('SELECT * FROM campaigns WHERE id = ?', [id]);
    if (!campaign) return res.status(404).json({ success: false, message: 'Campaign not found' });

    const [posts] = await db.query(`
      SELECT p.*, pl.name AS platform,
        k.likes, k.shares, k.comments, k.impressions, k.reach, k.engagement_rate
      FROM posts p
      JOIN social_media_platforms pl ON pl.id = p.platform_id
      LEFT JOIN kpis k ON k.post_id = p.id
      WHERE p.campaign_id = ?
    `, [id]);

    res.json({ success: true, data: { ...campaign, posts } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getAll, getOne };

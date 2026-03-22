const db = require('../config/db');

const getInsights = async (req, res) => {
  try {
    const [byAge] = await db.query(`
      SELECT age_group, SUM(engagement_count) AS total_engagement, ROUND(AVG(percentage),2) AS avg_pct
      FROM audience_insights GROUP BY age_group ORDER BY age_group
    `);
    const [byGender] = await db.query(`
      SELECT gender, SUM(engagement_count) AS total_engagement, ROUND(AVG(percentage),2) AS avg_pct
      FROM audience_insights GROUP BY gender
    `);
    const [byDevice] = await db.query(`
      SELECT device_type, SUM(engagement_count) AS total_engagement, ROUND(AVG(percentage),2) AS avg_pct
      FROM audience_insights GROUP BY device_type
    `);
    const [byLocation] = await db.query(`
      SELECT location, SUM(engagement_count) AS total_engagement
      FROM audience_insights GROUP BY location ORDER BY total_engagement DESC LIMIT 10
    `);
    res.json({ success: true, data: { byAge, byGender, byDevice, byLocation } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getInsights };

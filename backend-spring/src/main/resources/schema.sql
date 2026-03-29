-- ============================================================
-- MediaPulse Insights - Auto-initialized Schema
-- Runs on every startup; safe to re-run (idempotent)
-- ============================================================

CREATE TABLE IF NOT EXISTS users (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    full_name     VARCHAR(100)  NOT NULL,
    email         VARCHAR(100)  UNIQUE NOT NULL,
    password_hash VARCHAR(255)  NOT NULL,
    role          ENUM('marketing_team','content_creator','executive','it_support','admin')
                  DEFAULT 'marketing_team',
    is_active     BOOLEAN       DEFAULT TRUE,
    created_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS social_media_platforms (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    name         VARCHAR(50)  NOT NULL,
    api_key      VARCHAR(255),
    api_secret   VARCHAR(255),
    account_name VARCHAR(100),
    account_id   VARCHAR(100),
    platform_url VARCHAR(255),
    is_active    BOOLEAN      DEFAULT TRUE,
    created_at   TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS campaigns (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(200) NOT NULL,
    description     TEXT,
    start_date      DATE         NOT NULL,
    end_date        DATE         NOT NULL,
    budget          DECIMAL(15,2),
    target_audience VARCHAR(255),
    objectives      TEXT,
    status          ENUM('draft','active','paused','completed','cancelled')
                    DEFAULT 'draft',
    created_by      INT,
    created_at      TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS campaign_platforms (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    campaign_id INT NOT NULL,
    platform_id INT NOT NULL,
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE,
    FOREIGN KEY (platform_id) REFERENCES social_media_platforms(id) ON DELETE CASCADE,
    UNIQUE KEY unique_campaign_platform (campaign_id, platform_id)
);

CREATE TABLE IF NOT EXISTS posts (
    id               INT AUTO_INCREMENT PRIMARY KEY,
    campaign_id      INT,
    platform_id      INT NOT NULL,
    content          TEXT,
    media_type       ENUM('text','image','video','link','story','reel') DEFAULT 'text',
    post_url         VARCHAR(500),
    external_post_id VARCHAR(100),
    posted_at        TIMESTAMP,
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE SET NULL,
    FOREIGN KEY (platform_id) REFERENCES social_media_platforms(id)
);

CREATE TABLE IF NOT EXISTS kpis (
    id                INT AUTO_INCREMENT PRIMARY KEY,
    post_id           INT NOT NULL,
    likes             INT          DEFAULT 0,
    shares            INT          DEFAULT 0,
    comments          INT          DEFAULT 0,
    impressions       INT          DEFAULT 0,
    reach             INT          DEFAULT 0,
    click_through_rate DECIMAL(5,2) DEFAULT 0.00,
    engagement_rate   DECIMAL(5,2) DEFAULT 0.00,
    saves             INT          DEFAULT 0,
    video_views       INT          DEFAULT 0,
    recorded_at       TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS audience_insights (
    id               INT AUTO_INCREMENT PRIMARY KEY,
    post_id          INT,
    campaign_id      INT,
    age_group        ENUM('13-17','18-24','25-34','35-44','45-54','55-64','65+'),
    gender           ENUM('male','female','other','unknown'),
    location         VARCHAR(100),
    device_type      ENUM('desktop','mobile','tablet'),
    engagement_count INT          DEFAULT 0,
    percentage       DECIMAL(5,2) DEFAULT 0.00,
    recorded_at      TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id)     REFERENCES posts(id)     ON DELETE SET NULL,
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS reports (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    title        VARCHAR(200) NOT NULL,
    report_type  ENUM('campaign','platform','audience','engagement') NOT NULL,
    campaign_id  INT,
    platform_id  INT,
    generated_by INT,
    date_from    DATE,
    date_to      DATE,
    data_json    LONGTEXT,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (campaign_id)  REFERENCES campaigns(id)              ON DELETE SET NULL,
    FOREIGN KEY (platform_id)  REFERENCES social_media_platforms(id) ON DELETE SET NULL,
    FOREIGN KEY (generated_by) REFERENCES users(id)                  ON DELETE SET NULL
);

-- ============================================================
-- MOCK DATA (INSERT IGNORE skips duplicates on re-run)
-- Passwords: all are 'Password@123' (bcrypt hashed)
-- ============================================================

INSERT IGNORE INTO users (id, full_name, email, password_hash, role) VALUES
(1, 'Admin User',    'admin@mediapulse.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHiy', 'admin'),
(2, 'Sarah Johnson', 'sarah@mediapulse.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHiy', 'marketing_team'),
(3, 'David Lee',     'david@mediapulse.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHiy', 'content_creator'),
(4, 'Emily Chen',    'emily@mediapulse.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHiy', 'executive'),
(5, 'Mark Thompson', 'mark@mediapulse.com',  '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHiy', 'it_support');

INSERT IGNORE INTO social_media_platforms (id, name, api_key, account_name, account_id, platform_url) VALUES
(1, 'Facebook',  'fb_api_key_mock_001',  'MediaPulse Official', 'mp_fb_001', 'https://facebook.com/mediapulse'),
(2, 'Twitter',   'tw_api_key_mock_002',  'MediaPulse',          'mp_tw_002', 'https://twitter.com/mediapulse'),
(3, 'Instagram', 'ig_api_key_mock_003',  'mediapulse_ig',       'mp_ig_003', 'https://instagram.com/mediapulse'),
(4, 'LinkedIn',  'li_api_key_mock_004',  'MediaPulse Insights', 'mp_li_004', 'https://linkedin.com/company/mediapulse');

INSERT IGNORE INTO campaigns (id, name, description, start_date, end_date, budget, target_audience, objectives, status, created_by) VALUES
(1, 'Spring Sale 2025',      'Promote spring product launch across all platforms', '2025-03-01', '2025-03-31', 15000.00, 'Age 18-35, tech enthusiasts', 'Increase brand awareness by 20%', 'completed', 2),
(2, 'Brand Awareness Q2',    'Quarterly brand awareness campaign',                 '2025-04-01', '2025-06-30', 25000.00, 'Age 25-45, professionals',   'Reach 500K new users',           'active',    2),
(3, 'Product Launch X1',     'New product X1 launch campaign',                    '2025-05-15', '2025-06-15', 10000.00, 'Age 18-40, early adopters',  'Generate 10K pre-orders',        'active',    2),
(4, 'Holiday Campaign 2025', 'Holiday season marketing push',                      '2025-11-01', '2025-12-31', 50000.00, 'General audience',           'Drive 30% sales uplift',         'draft',     2);

INSERT IGNORE INTO campaign_platforms (campaign_id, platform_id) VALUES
(1,1),(1,2),(1,3),
(2,1),(2,2),(2,3),(2,4),
(3,2),(3,3),
(4,1),(4,2),(4,3),(4,4);

INSERT IGNORE INTO posts (id, campaign_id, platform_id, content, media_type, post_url, external_post_id, posted_at) VALUES
(1, 1, 1, 'Spring is here! Check out our latest collection. #SpringSale #NewArrivals', 'image', 'https://facebook.com/post/001',  'fb_post_001', '2025-03-05 10:00:00'),
(2, 1, 2, 'Our spring sale is live! Tap the link to explore. #SpringSale',             'image', 'https://twitter.com/post/001',   'tw_post_001', '2025-03-05 10:30:00'),
(3, 1, 3, 'Spring vibes only. Swipe to see our new arrivals!',                         'reel',  'https://instagram.com/post/001', 'ig_post_001', '2025-03-06 12:00:00'),
(4, 2, 1, 'Building the future of marketing analytics. Learn more about us!',         'video', 'https://facebook.com/post/002',  'fb_post_002', '2025-04-10 09:00:00'),
(5, 2, 4, 'We help businesses make smarter marketing decisions with real-time data.',  'text',  'https://linkedin.com/post/002',  'li_post_002', '2025-04-11 08:00:00'),
(6, 3, 2, 'Introducing X1 - the product youve been waiting for! #ProductX1',          'video', 'https://twitter.com/post/003',   'tw_post_003', '2025-05-16 14:00:00'),
(7, 3, 3, 'Meet X1. A revolution in your hands. Link in bio to pre-order!',           'reel',  'https://instagram.com/post/003', 'ig_post_003', '2025-05-16 15:00:00');

INSERT IGNORE INTO kpis (post_id, likes, shares, comments, impressions, reach, click_through_rate, engagement_rate, saves, video_views) VALUES
(1, 4520,  980, 312,  85000,  72000, 3.20,  6.84, 210,  NULL),
(2, 2310,  540, 189,  45000,  38000, 2.85,  6.75, NULL, NULL),
(3, 8900, 1200, 670, 120000,  98000, 4.10,  9.12, 3400, 45000),
(4, 3100,  420, 265,  62000,  54000, 2.50,  5.47, 190,  18000),
(5, 1850,  310,  98,  28000,  24000, 3.75,  8.10, NULL, NULL),
(6, 5600,  900, 410,  95000,  82000, 3.90,  7.27, NULL, 62000),
(7,12400, 1800, 930, 180000, 150000, 5.20, 11.35, 5100, 98000);

INSERT IGNORE INTO audience_insights (post_id, campaign_id, age_group, gender, location, device_type, engagement_count, percentage) VALUES
(1, 1, '18-24', 'female', 'New York, USA',     'mobile',  1200, 26.5),
(1, 1, '25-34', 'female', 'Los Angeles, USA',  'mobile',  1500, 33.2),
(1, 1, '25-34', 'male',   'Chicago, USA',      'desktop',  980, 21.7),
(2, 1, '18-24', 'male',   'Houston, USA',      'mobile',   780, 33.8),
(2, 1, '25-34', 'female', 'Phoenix, USA',      'mobile',   620, 26.8),
(3, 1, '18-24', 'female', 'Miami, USA',        'mobile',  3200, 36.0),
(3, 1, '18-24', 'male',   'Seattle, USA',      'mobile',  2800, 31.5),
(4, 2, '35-44', 'male',   'Boston, USA',       'desktop', 1100, 35.5),
(4, 2, '25-34', 'female', 'Denver, USA',       'desktop',  890, 28.7),
(5, 2, '35-44', 'male',   'San Francisco, USA','desktop',  680, 36.8),
(6, 3, '18-24', 'male',   'Austin, USA',       'mobile',  2200, 39.3),
(6, 3, '25-34', 'male',   'Portland, USA',     'mobile',  1800, 32.1),
(7, 3, '18-24', 'female', 'Nashville, USA',    'mobile',  4800, 38.7),
(7, 3, '18-24', 'male',   'Atlanta, USA',      'mobile',  4100, 33.1);

require('dotenv').config();
const express = require('express');
const cors    = require('cors');

const authRoutes      = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const campaignRoutes  = require('./routes/campaigns');
const analyticsRoutes = require('./routes/analytics');
const audienceRoutes  = require('./routes/audience');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || /^http:\/\/localhost(:\d+)?$/.test(origin)) callback(null, true);
    else callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth',      authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/audience',  audienceRoutes);

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'MediaPulse API is running', timestamp: new Date() });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found.' });
});

app.listen(PORT, () => {
  console.log(`MediaPulse API running on http://localhost:${PORT}`);
});

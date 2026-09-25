require('dotenv').config();
const express = require('express');
const cors = require('cors');

const healthRoutes = require('./routes/health.routes');
const projectRoutes = require('./routes/project.routes');
const alertRoutes = require('./routes/alert.routes');
const analyticsRoutes = require('./routes/analytics.routes');
const aiRoutes = require('./routes/ai.routes');
const transactionRoutes = require('./routes/transaction.routes');
const reportRoutes = require('./routes/report.routes');
const authRoutes = require('./routes/auth.routes');

const path = require('path');

const app = express();

// Global Middlewares - Dynamic CORS with credentials support for Vercel/Netlify/Localhost
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like curl, Postman, mobile apps, or local server calls)
        if (!origin) return callback(null, true);
        // Reflect origin dynamically to support credentials across domains
        return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-openai-key', 'x-groq-key', 'x-api-key', 'Accept', 'Origin', 'X-Requested-With']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root entry point serves dashboard
app.get(['/', '/dashboard'], (req, res) => {
    res.redirect('/index.html');
});

// Dedicated login redirects
app.get(['/login', '/login.html'], (req, res) => {
    res.redirect('/pages/login.html');
});

// Dedicated connection test & diagnostic redirects
app.get(['/test', '/connection-test', '/status'], (req, res) => {
    res.redirect('/connection-test.html');
});

// API Routes
app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/reports', reportRoutes);

// Serve frontend website directory statically on the exact same host & port
const websiteDir = path.resolve(__dirname, '../../website');
app.use(express.static(websiteDir, {
    index: false,
    setHeaders: (res) => {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
    }
}));

// API Info endpoint
app.get('/api', (req, res) => {
    res.json({
        platform: "MPLADS Monitoring & Analytics Platform REST API",
        version: "2.5.0",
        status: "Online"
    });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Endpoint ${req.originalUrl} not found on MPLADS backend`
    });
});

// Central Error Handler
app.use((err, req, res, next) => {
    console.error('[Error]', err.stack || err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
});

module.exports = app;

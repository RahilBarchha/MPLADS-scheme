require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`[MPLADS Backend] Server running on port ${PORT}`);
    console.log(`[MPLADS Backend] Health check: http://localhost:${PORT}/api/health`);
});

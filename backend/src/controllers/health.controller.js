/**
 * Health Check Controller
 * Returns platform health and operational status
 */
const getHealthStatus = (req, res) => {
    return res.status(200).json({
        success: true,
        message: "MPLADS API is running",
        timestamp: new Date().toISOString(),
        version: "1.0.0"
    });
};

module.exports = {
    getHealthStatus
};

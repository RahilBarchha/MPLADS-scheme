from fastapi import FastAPI

app = FastAPI(
    title="MPLADS ML & Analytics Service",
    description="Machine Learning, Anomaly Detection, and Forecasting Engine for MPLADS Platform",
    version="1.0.0"
)

@app.get("/")
def read_root():
    return {
        "service": "MPLADS ML Service",
        "status": "Online",
        "version": "1.0.0"
    }

@app.get("/health")
def read_health():
    return {
        "success": True,
        "message": "MPLADS ML service is healthy",
        "status": "healthy"
    }

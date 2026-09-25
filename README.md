# MPLADS Monitoring & Analytics Platform

> **Autonomous AI-Powered Governance & Real-Time Tracking for the Member of Parliament Local Area Development Scheme (MPLADS)**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)
[![FastAPI](https://img.shields.io/badge/Python-FastAPI-teal.svg)](https://fastapi.tiangolo.com/)

---

## 🏛️ Overview

The **MPLADS Monitoring & Analytics Platform** is a digital governance solution designed to streamline the lifecycle of developmental projects recommended under the MPLAD Scheme. It equips Ministry officials, District Magistrates, Nodal Officers, and citizens with automated workflows, anomaly detection, real-time fund tracking, and geo-spatial project intelligence.

---

## ✨ Key Features

- **📊 Executive Dashboard**: Comprehensive national, state, and district-level metrics covering fund allocation, expenditure velocity, and completion rates.
- **🗺️ Interactive Geo-Tagging & GIS Map**: Spatial distribution of developmental works with stage-based color codes and district inspection statuses.
- **🤖 Autonomous AI Copilot & Anomaly Detection**: Integrated AI governance assistant capable of flagging stalled projects, cost overruns, and utilization discrepancies.
- **💼 Role-Based Governance Access**: Secure access profiles for Central Ministry Evaluators, District Magistrates (IAS), and Implementing Agencies.
- **📈 Fund Management & Audit Trails**: Multi-tiered tracking of sanctions, releases, contractor disbursements, and unspent balances.
- **📑 Automated Reporting**: Instant export of compliance dossiers, utilization certificates, and physical audit summaries (PDF/CSV formats).

---

## 🛠️ System Architecture & Tech Stack

- **Frontend**: Clean Vanilla JavaScript (ES6+), HTML5, CSS3 Glassmorphism UI, Leaflet.js (GIS), Chart.js
- **Backend API**: Node.js & Express.js modular REST API architecture
- **ML / Analytics Service**: Python FastAPI anomaly detection & forecasting microservice
- **Deployment**: Static web server / Vercel ready configuration

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [Python 3.9+](https://www.python.org/) (for optional ML microservice)
- [Git](https://git-scm.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/RahilBarchha/MPLADS-scheme.git
cd MPLADS-scheme
```

### 2. Environment Configuration

Copy the example environment template and configure any optional keys:

```bash
cp .env.example .env
```

### 3. Run the Web Application

To launch the static web portal and development server:

```bash
node server-static.js
```

Then open your browser and navigate to:
```
http://localhost:3000
```

### 4. Run the Backend REST Service (Optional)

```bash
node backend/src/server.js
```
The REST API runs on `http://localhost:5000`.

### 5. Run the Python ML Service (Optional)

```bash
cd ml-service
pip install -r requirements.txt
uvicorn app.main:app --port 8000 --reload
```

---

## 📂 Project Structure

```text
├── backend/                  # Node.js Express REST API
│   └── src/
│       ├── controllers/      # API Request Handlers
│       ├── routes/           # REST Route Endpoints
│       ├── services/         # Business & AI Services
│       └── data/             # Seed Data & Schemas
├── website/                  # Web Client Frontend
│   ├── css/                  # Modern Glassmorphic Stylesheets
│   ├── js/                   # Core Frontend Logic & APIs
│   ├── pages/                # Functional Views (Dashboard, Map, Funds, etc.)
│   └── assets/               # Icons, Images & Libraries
├── ml-service/               # FastAPI ML & Forecasting Engine
├── database/                 # Migrations & Database Seeds
├── .env.example              # Environment Variable Template
├── server-static.js          # Unified Local Development Server
└── package.json              # Project Dependencies & Scripts
```

---

## 🔒 Security & Privacy

- All sensitive API keys and environment configurations are excluded via `.gitignore`.
- Authentication tokens and credentials should be managed via environment variables.

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).

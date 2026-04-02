# 🛒 KiranaAI - AI-Powered Inventory Forecasting System

![KiranaAI Banner](https://img.shields.io/badge/Status-Production_Ready-success?style=for-the-badge) ![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi) ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) ![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)

KiranaAI is a full-stack, AI-driven inventory forecasting platform designed exclusively for small-scale retail and kirana stores. Built to run efficiently on low-resource environments, it leverages time-series machine learning models to forecast demand and automate reordering thresholds.

---

## ✨ Features
- **📊 AI Demand Forecasting**: Utilizes `StatsModels` Simple Exponential Smoothing to predict future SKU demands based on historical CSV data.
- **🚨 Automated Reorder Alerts**: Recommends optimal stocking levels dynamically, notifying managers of Critical vs Healthy SKUs.
- **🎨 Glassmorphism Dashboard**: A stunning, modern React UI styled with an elegant dark mode and animated Recharts.
- **🔐 Google SSO**: Fully integrated identity security via Google OAuth 2.0 Contexts.
- **🐳 Production Ready**: Includes Docker multi-stage orchestration for Nginx and Uvicorn deployment.

## 🚀 Getting Started

### 1. Requirements
- Node.js (18+)
- Python (3.11+)
- Docker (optional for production mode)

### 2. Environment Setup
Before starting, ensure you install your actual Google OAuth Client ID into both `backend/.env` and `frontend/.env`.

### 3. Running Locally (Dev Mode)

**Backend API:**
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```
API running on `http://127.0.0.1:8000`

**Frontend Dashboard:**
```bash
cd frontend
npm install
npm run dev
```
Client running on `http://localhost:5173`

### 4. Running Production System via Docker
Easily launch the entire robust stack via Docker Compose:
```bash
docker-compose up --build -d
```
Access the served Nginx React build directly at `http://localhost:80`.

## 📈 Testing
Experience the ML module by navigating to the **Data Upload** tab and importing the included `backend/sample_sales.csv`. 

---
*Built to empower local retailers with predictive intelligence.*
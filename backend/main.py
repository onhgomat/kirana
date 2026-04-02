from fastapi import FastAPI, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import io

import models
from database import engine, get_db

# Create all tables in the database
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Inventory Forecasting API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For production, restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the AI-powered Inventory Forecasting API"}

import crud

@app.post("/upload-sales")
async def upload_sales(file: UploadFile = File(...), db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Invalid file format. Upload a CSV.")
        
    try:
        contents = await file.read()
        df = pd.read_csv(io.StringIO(contents.decode("utf-8")))
        
        # Use crud utility to ingest parsed dataframe
        records_added = crud.ingest_sales_data(db, df)
        
        return {"message": f"Successfully uploaded {file.filename} and processed {records_added} records", "rows": len(df)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

import forecasting
import auth
from auth import get_current_user

app.include_router(auth.router)

@app.get("/forecast")
def generate_forecasts(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    count = forecasting.run_forecasts(db)
    return {"message": f"Successfully generated forecasts for {count} products"}

@app.get("/inventory")
def get_inventory(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    products = db.query(models.Product).all()
    results = []
    for p in products:
        alerts = db.query(models.Alert).filter(models.Alert.product_id == p.id).all()
        results.append({
            "id": p.id,
            "sku": p.sku,
            "name": p.name,
            "current_stock": p.current_stock,
            "optimal_stock": p.optimal_stock_level,
            "alerts": [{"message": a.message, "is_critical": a.is_critical, "date": a.alert_date} for a in alerts]
        })
    return results

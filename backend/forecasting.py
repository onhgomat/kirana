import pandas as pd
from sqlalchemy.orm import Session
import models
from datetime import timedelta
import datetime
from statsmodels.tsa.holtwinters import SimpleExpSmoothing

def generate_forecast_for_product(db: Session, product_id: int):
    # Fetch sales data
    sales = db.query(models.SalesData).filter(models.SalesData.product_id == product_id).order_by(models.SalesData.date).all()
    if not sales or len(sales) < 5:
        return False # Not enough data
        
    df = pd.DataFrame([{"date": s.date, "qty": s.quantity_sold} for s in sales])
    df.set_index("date", inplace=True)
    df = df.resample("D").sum().fillna(0) # Daily sales freq
    
    # Predict next 7 days demand using simple exponential smoothing
    try:
        model = SimpleExpSmoothing(df['qty'], initialization_method="estimated").fit(smoothing_level=0.2, optimized=False)
        forecast = model.forecast(7)
    except Exception:
        # Fallback to simple moving average over last 7 days
        avg = df['qty'].tail(7).mean()
        forecast = pd.Series([avg]*7, index=pd.date_range(start=df.index[-1] + timedelta(days=1), periods=7))
        
    # Clear old forecasts
    db.query(models.Forecast).filter(models.Forecast.product_id == product_id).delete()
    
    # Save new forecasts & calc total demand
    total_predicted_demand = 0
    for dt, val in forecast.items():
        demand_val = max(0, float(val))
        db.add(models.Forecast(product_id=product_id, predicted_date=dt.to_pydatetime(), predicted_demand=demand_val))
        total_predicted_demand += demand_val
        
    # Set optimal stock level: 7 days demand + 20% buffer
    optimal_stock = int(total_predicted_demand * 1.2)
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    
    if product:
        product.optimal_stock_level = optimal_stock
        
        # Determine inventory alerts
        db.query(models.Alert).filter(models.Alert.product_id == product_id).delete()
        if product.current_stock < total_predicted_demand:
            db.add(models.Alert(
                product_id=product_id, 
                message=f"Critical: Current stock ({product.current_stock}) will not cover 7-day predicted demand ({int(total_predicted_demand)}). Reorder immediately.",
                is_critical=1
            ))
        elif product.current_stock < optimal_stock:
            db.add(models.Alert(
                product_id=product_id, 
                message=f"Warning: Stock ({product.current_stock}) below optimal level ({optimal_stock}). Consider reordering soon.",
                is_critical=0
            ))
            
    db.commit()
    return True

def run_forecasts(db: Session):
    products = db.query(models.Product).all()
    count = 0
    for p in products:
        if generate_forecast_for_product(db, p.id):
            count += 1
    return count

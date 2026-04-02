from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
import datetime

from database import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    sku = Column(String, unique=True, index=True)
    name = Column(String)
    current_stock = Column(Integer, default=0)
    optimal_stock_level = Column(Integer, default=0)

    sales = relationship("SalesData", back_populates="product")
    forecasts = relationship("Forecast", back_populates="product")
    alerts = relationship("Alert", back_populates="product")

class SalesData(Base):
    __tablename__ = "sales_data"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"))
    date = Column(DateTime, default=datetime.datetime.utcnow)
    quantity_sold = Column(Integer)

    product = relationship("Product", back_populates="sales")

class Forecast(Base):
    __tablename__ = "forecasts"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"))
    predicted_date = Column(DateTime)
    predicted_demand = Column(Float)

    product = relationship("Product", back_populates="forecasts")

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"))
    message = Column(String)
    alert_date = Column(DateTime, default=datetime.datetime.utcnow)
    is_critical = Column(Integer, default=0) # 0 for warning, 1 for critical

    product = relationship("Product", back_populates="alerts")

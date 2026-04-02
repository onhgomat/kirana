from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class ProductBase(BaseModel):
    sku: str
    name: Optional[str] = None

class ProductCreate(ProductBase):
    pass

class Product(ProductBase):
    id: int
    current_stock: int
    optimal_stock_level: int

    class Config:
        from_attributes = True

class SalesUploadResponse(BaseModel):
    message: str
    rows: int

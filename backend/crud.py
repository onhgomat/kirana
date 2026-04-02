from sqlalchemy.orm import Session
import models, schemas
import pandas as pd
import datetime

def get_product_by_sku(db: Session, sku: str):
    return db.query(models.Product).filter(models.Product.sku == sku).first()

def create_product(db: Session, sku: str, name: str = None):
    db_product = models.Product(sku=sku, name=name)
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

def ingest_sales_data(db: Session, df: pd.DataFrame):
    # Expected columns: sku, date, quantity_sold
    # Normalize column names
    df.columns = [c.strip().lower() for c in df.columns]
    
    records_added = 0
    for _, row in df.iterrows():
        sku = str(row['sku'])
        qty = int(row['quantity_sold'])
        
        # simple parsing of date, you could make this more robust
        try:
            sale_date = pd.to_datetime(row['date']).to_pydatetime()
        except:
            sale_date = datetime.datetime.utcnow()
            
        product = get_product_by_sku(db, sku)
        if not product:
            product = create_product(db, sku=sku, name=f"Product {sku}")
            
        sale_record = models.SalesData(
            product_id=product.id,
            date=sale_date,
            quantity_sold=qty
        )
        db.add(sale_record)
        
        # update current stock (mock representation, typically uploading sales decrements stock)
        # for forecasting, we just need history.
        records_added += 1
        
    db.commit()
    return records_added

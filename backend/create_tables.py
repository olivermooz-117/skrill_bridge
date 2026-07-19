#!/usr/bin/env python
from app import create_app
from app.extensions import db
from app.models import User, Gig, Order, Review, Tag

app = create_app()

def create_tables():
    with app.app_context():
        print("📊 Creating database tables...")
        db.create_all()
        print("✅ Tables created successfully!")
        
        # Verify tables
        from sqlalchemy import inspect
        inspector = inspect(db.engine)
        tables = inspector.get_table_names()
        print(f"📋 Tables: {tables}")

if __name__ == "__main__":
    create_tables()

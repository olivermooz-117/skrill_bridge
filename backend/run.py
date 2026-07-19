from app import create_app
from app.extensions import db
from app.models import User, Gig, Order, Review, Tag
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = create_app()

# Create tables if they don't exist (for production)
with app.app_context():
    try:
        logger.info("📊 Checking database tables...")
        db.create_all()
        logger.info("✅ Database tables verified/created successfully!")
        
        # Verify tables
        from sqlalchemy import inspect
        inspector = inspect(db.engine)
        tables = inspector.get_table_names()
        logger.info(f"📋 Tables: {tables}")
        
    except Exception as e:
        logger.error(f"⚠️ Database issue: {e}")

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
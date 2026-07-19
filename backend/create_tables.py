import os
import sys
import logging
from app import create_app
from app.extensions import db
from app.models import User, Gig, Order, Review, Tag

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def create_tables():
    """Create all database tables"""
    app = create_app()
    
    with app.app_context():
        logger.info(" Creating database tables...")
        db.create_all()
        logger.info(" Tables created successfully!")
        
        # Verify tables were created
        from sqlalchemy import inspect
        inspector = inspect(db.engine)
        tables = inspector.get_table_names()
        logger.info(f" Tables created: {tables}")
        
        # Check if any users exist
        user_count = User.query.count()
        logger.info(f" Existing users: {user_count}")
        
        if not User.query.first():
            logger.info(" No users found. You may want to create a test user.")
        else:
            logger.info(f" Found {user_count} users")

if __name__ == "__main__":
    create_tables()
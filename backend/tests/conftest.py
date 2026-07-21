import sys
import os

# Add the parent directory (backend) to Python path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Also add the current directory
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

import pytest
from app import create_app
from app.extensions import db

@pytest.fixture(scope='session')
def app():
    """Create Flask app for testing"""
    app = create_app()
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    return app

@pytest.fixture(scope='session')
def client(app):
    """Create test client"""
    return app.test_client()

@pytest.fixture(autouse=True)
def setup_db(app):
    """Setup database for each test"""
    with app.app_context():
        db.create_all()
        yield
        db.drop_all()

import json
import pytest
import time
from app import create_app
from app.extensions import db
from app.models.user import User

@pytest.fixture
def client():
    app = create_app()
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    
    with app.test_client() as client:
        with app.app_context():
            db.create_all()
            yield client
            db.drop_all()

def test_register_success(client):
    """Test successful user registration"""
    response = client.post('/api/auth/register',
        json={
            'name': 'Test User',
            'email': f'test_{int(time.time())}@test.com',  # Unique email
            'password': 'password123',
            'role': 'client'
        }
    )
    assert response.status_code == 201
    data = response.get_json()
    assert data['message'] == 'User registered successfully'
    assert 'access_token' in data
    assert data['user']['email'].startswith('test_')
    assert data['user']['role'] == 'client'

def test_register_missing_fields(client):
    """Test registration with missing fields"""
    response = client.post('/api/auth/register',
        json={
            'name': 'Test User',
            'email': 'test@test.com'
        }
    )
    assert response.status_code == 400
    data = response.get_json()
    assert 'error' in data

def test_register_duplicate_email(client):
    """Test registration with duplicate email"""
    # First registration
    client.post('/api/auth/register',
        json={
            'name': 'Test User',
            'email': 'test@test.com',
            'password': 'password123',
            'role': 'client'
        }
    )
    
    # Second registration with same email
    response = client.post('/api/auth/register',
        json={
            'name': 'Another User',
            'email': 'test@test.com',
            'password': 'password456',
            'role': 'freelancer'
        }
    )
    assert response.status_code == 409
    data = response.get_json()
    assert data['error'] == 'Email already registered'

def test_register_invalid_email(client):
    """Test registration with invalid email format"""
    response = client.post('/api/auth/register',
        json={
            'name': 'Test User',
            'email': 'invalid-email',
            'password': 'password123',
            'role': 'client'
        }
    )
    assert response.status_code == 400
    data = response.get_json()
    assert 'error' in data

def test_login_success(client):
    """Test successful login"""
    # Register user first
    client.post('/api/auth/register',
        json={
            'name': 'Test User',
            'email': 'test@test.com',
            'password': 'password123',
            'role': 'client'
        }
    )
    
    # Login
    response = client.post('/api/auth/login',
        json={
            'email': 'test@test.com',
            'password': 'password123'
        }
    )
    assert response.status_code == 200
    data = response.get_json()
    assert data['message'] == 'Login successful'
    assert 'access_token' in data
    assert data['user']['email'] == 'test@test.com'

def test_login_wrong_password(client):
    """Test login with wrong password"""
    # Register user first
    client.post('/api/auth/register',
        json={
            'name': 'Test User',
            'email': 'test@test.com',
            'password': 'password123',
            'role': 'client'
        }
    )
    
    # Login with wrong password
    response = client.post('/api/auth/login',
        json={
            'email': 'test@test.com',
            'password': 'wrongpassword'
        }
    )
    assert response.status_code == 401
    data = response.get_json()
    assert data['error'] == 'Invalid credentials'

def test_login_nonexistent_user(client):
    """Test login with non-existent user"""
    response = client.post('/api/auth/login',
        json={
            'email': 'nonexistent@test.com',
            'password': 'password123'
        }
    )
    assert response.status_code == 401
    data = response.get_json()
    assert data['error'] == 'Invalid credentials'

def test_get_current_user(client):
    """Test getting current user with valid token"""
    # Register user
    register_response = client.post('/api/auth/register',
        json={
            'name': 'Test User',
            'email': 'test@test.com',
            'password': 'password123',
            'role': 'client'
        }
    )
    token = register_response.get_json()['access_token']
    
    # Get current user
    response = client.get('/api/auth/me',
        headers={'Authorization': f'Bearer {token}'}
    )
    assert response.status_code == 200
    data = response.get_json()
    assert data['email'] == 'test@test.com'
    assert data['name'] == 'Test User'

def test_get_current_user_no_token(client):
    """Test getting current user without token"""
    response = client.get('/api/auth/me')
    assert response.status_code == 401
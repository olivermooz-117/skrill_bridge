import json
import pytest
from app import create_app
from app.extensions import db
from app.models.user import User
from app.models.gig import Gig
from app.models.tag import Tag

@pytest.fixture
def client():
    app = create_app()
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    
    with app.test_client() as client:
        with app.app_context():
            db.create_all()
            
            # Create freelancer user
            freelancer = User(
                name='Freelancer User',
                email='freelancer@test.com',
                role='freelancer',
                bio='Test freelancer'
            )
            freelancer.set_password('password123')
            db.session.add(freelancer)
            db.session.commit()
            
            yield client
            db.drop_all()

def test_get_gigs_empty(client):
    """Test getting gigs when none exist"""
    response = client.get('/api/gigs')
    assert response.status_code == 200
    data = response.get_json()
    assert data['gigs'] == []
    assert data['total'] == 0

def test_create_gig_success(client):
    """Test creating a gig successfully"""
    # Login to get token
    login_response = client.post('/api/auth/login',
        json={
            'email': 'freelancer@test.com',
            'password': 'password123'
        }
    )
    token = login_response.get_json()['access_token']
    
    # Create gig
    response = client.post('/api/gigs',
        json={
            'title': 'Build a Website',
            'description': 'I will build a professional website',
            'price': 500,
            'delivery_days': 7,
            'tags': ['web', 'development']
        },
        headers={'Authorization': f'Bearer {token}'}
    )
    assert response.status_code == 201
    data = response.get_json()
    assert data['message'] == 'Gig created successfully'
    assert data['gig']['title'] == 'Build a Website'
    assert data['gig']['price'] == 500.0
    assert len(data['gig']['tags']) == 2

def test_create_gig_missing_fields(client):
    """Test creating a gig with missing fields"""
    # Login to get token
    login_response = client.post('/api/auth/login',
        json={
            'email': 'freelancer@test.com',
            'password': 'password123'
        }
    )
    token = login_response.get_json()['access_token']
    
    # Create gig with missing fields
    response = client.post('/api/gigs',
        json={
            'title': 'Build a Website'
        },
        headers={'Authorization': f'Bearer {token}'}
    )
    assert response.status_code == 400
    data = response.get_json()
    assert 'error' in data

def test_create_gig_no_token(client):
    """Test creating a gig without token"""
    response = client.post('/api/gigs',
        json={
            'title': 'Build a Website',
            'description': 'I will build a professional website',
            'price': 500,
            'delivery_days': 7
        }
    )
    assert response.status_code == 401

def test_get_single_gig(client):
    """Test getting a single gig"""
    # Login to get token
    login_response = client.post('/api/auth/login',
        json={
            'email': 'freelancer@test.com',
            'password': 'password123'
        }
    )
    token = login_response.get_json()['access_token']
    
    # Create a gig
    create_response = client.post('/api/gigs',
        json={
            'title': 'Build a Website',
            'description': 'I will build a professional website',
            'price': 500,
            'delivery_days': 7,
            'tags': ['web']
        },
        headers={'Authorization': f'Bearer {token}'}
    )
    gig_id = create_response.get_json()['gig']['id']
    
    # Get the gig
    response = client.get(f'/api/gigs/{gig_id}')
    assert response.status_code == 200
    data = response.get_json()
    assert data['id'] == gig_id
    assert data['title'] == 'Build a Website'

def test_get_nonexistent_gig(client):
    """Test getting a gig that doesn't exist"""
    response = client.get('/api/gigs/999')
    assert response.status_code == 404
    data = response.get_json()
    assert data['error'] == 'Gig not found'

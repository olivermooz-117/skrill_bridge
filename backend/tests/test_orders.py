import json
import pytest
from app import create_app
from app.extensions import db
from app.models.user import User
from app.models.gig import Gig

@pytest.fixture
def client():
    app = create_app()
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    
    with app.test_client() as client:
        with app.app_context():
            db.create_all()
            
            # Create freelancer
            freelancer = User(
                name='Freelancer User',
                email='freelancer@test.com',
                role='freelancer',
                bio='Test freelancer'
            )
            freelancer.set_password('password123')
            db.session.add(freelancer)
            
            # Create client
            client_user = User(
                name='Client User',
                email='client@test.com',
                role='client',
                bio='Test client'
            )
            client_user.set_password('password123')
            db.session.add(client_user)
            
            db.session.commit()
            
            yield client
            db.drop_all()

def test_create_order_success(client):
    """Test creating an order successfully"""
    # Login as freelancer to create gig
    freelancer_login = client.post('/api/auth/login',
        json={
            'email': 'freelancer@test.com',
            'password': 'password123'
        }
    )
    freelancer_token = freelancer_login.get_json()['access_token']
    
    # Create a gig
    gig_response = client.post('/api/gigs',
        json={
            'title': 'Build a Website',
            'description': 'I will build a professional website',
            'price': 500,
            'delivery_days': 7
        },
        headers={'Authorization': f'Bearer {freelancer_token}'}
    )
    gig_id = gig_response.get_json()['gig']['id']
    
    # Login as client
    client_login = client.post('/api/auth/login',
        json={
            'email': 'client@test.com',
            'password': 'password123'
        }
    )
    client_token = client_login.get_json()['access_token']
    
    # Create order
    response = client.post('/api/orders',
        json={
            'gig_id': gig_id,
            'requirements': 'I need a responsive website'
        },
        headers={'Authorization': f'Bearer {client_token}'}
    )
    assert response.status_code == 201
    data = response.get_json()
    assert data['message'] == 'Order created successfully'
    assert data['order']['gig_id'] == gig_id
    assert data['order']['status'] == 'pending'

def test_create_order_no_gig(client):
    """Test creating an order for a non-existent gig"""
    # Login as client
    client_login = client.post('/api/auth/login',
        json={
            'email': 'client@test.com',
            'password': 'password123'
        }
    )
    client_token = client_login.get_json()['access_token']
    
    response = client.post('/api/orders',
        json={
            'gig_id': 999,
            'requirements': 'I need a responsive website'
        },
        headers={'Authorization': f'Bearer {client_token}'}
    )
    assert response.status_code == 404
    data = response.get_json()
    assert data['error'] == 'Gig not found or inactive'

def test_get_orders(client):
    """Test getting user orders"""
    # Create gig and order first
    # Login as freelancer
    freelancer_login = client.post('/api/auth/login',
        json={
            'email': 'freelancer@test.com',
            'password': 'password123'
        }
    )
    freelancer_token = freelancer_login.get_json()['access_token']
    
    # Create gig
    gig_response = client.post('/api/gigs',
        json={
            'title': 'Build a Website',
            'description': 'I will build a professional website',
            'price': 500,
            'delivery_days': 7
        },
        headers={'Authorization': f'Bearer {freelancer_token}'}
    )
    gig_id = gig_response.get_json()['gig']['id']
    
    # Login as client
    client_login = client.post('/api/auth/login',
        json={
            'email': 'client@test.com',
            'password': 'password123'
        }
    )
    client_token = client_login.get_json()['access_token']
    
    # Create order
    client.post('/api/orders',
        json={
            'gig_id': gig_id,
            'requirements': 'I need a responsive website'
        },
        headers={'Authorization': f'Bearer {client_token}'}
    )
    
    # Get orders
    response = client.get('/api/orders',
        headers={'Authorization': f'Bearer {client_token}'}
    )
    assert response.status_code == 200
    data = response.get_json()
    assert len(data['orders']) == 1
    assert data['orders'][0]['gig_id'] == gig_id

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.order import Order
from app.models.gig import Gig
from app.models.review import Review
from app.extensions import db

orders_bp = Blueprint('orders', __name__, url_prefix='/api/orders')

@orders_bp.route('/', methods=['GET'])
@jwt_required()
def get_orders():
    """GET endpoint for orders: Get user's orders"""
    current_user_id = get_jwt_identity()
    status = request.args.get('status')
    
    query = Order.query.filter_by(client_id=current_user_id)
    if status:
        query = query.filter_by(status=status)
    
    orders = query.order_by(Order.created_at.desc()).all()
    
    return jsonify({
        'orders': [order.to_dict() for order in orders]
    }), 200

@orders_bp.route('/', methods=['POST'])
@jwt_required()
def create_order():
    """POST endpoint 2: Create a new order"""
    data = request.get_json()
    current_user_id = get_jwt_identity()
    
    if 'gig_id' not in data:
        return jsonify({'error': 'Gig ID required'}), 400
    
    gig = Gig.query.get(data['gig_id'])
    if not gig or not gig.is_active:
        return jsonify({'error': 'Gig not found or inactive'}), 404
    
    # Check if user already has an active order for this gig
    existing_order = Order.query.filter_by(
        gig_id=gig.id,
        client_id=current_user_id,
        status='pending'
    ).first()
    
    if existing_order:
        return jsonify({'error': 'You already have a pending order for this gig'}), 409
    
    order = Order(
        gig_id=gig.id,
        client_id=current_user_id,
        total_price=gig.price,
        requirements=data.get('requirements', '')
    )
    
    db.session.add(order)
    db.session.commit()
    
    return jsonify({
        'message': 'Order created successfully',
        'order': order.to_dict()
    }), 201

@orders_bp.route('/<int:order_id>', methods=['PUT'])
@jwt_required()
def update_order_status(order_id):
    """PUT endpoint 2: Update order status"""
    current_user_id = get_jwt_identity()
    order = Order.query.get(order_id)
    
    if not order:
        return jsonify({'error': 'Order not found'}), 404
    
    # Check if user owns the order
    if order.client_id != current_user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    data = request.get_json()
    new_status = data.get('status')
    
    valid_statuses = ['pending', 'in_progress', 'completed', 'cancelled']
    if new_status not in valid_statuses:
        return jsonify({'error': 'Invalid status'}), 400
    
    order.status = new_status
    db.session.commit()
    
    return jsonify({
        'message': 'Order status updated',
        'order': order.to_dict()
    }), 200

@orders_bp.route('/<int:order_id>', methods=['DELETE'])
@jwt_required()
def cancel_order(order_id):
    """DELETE endpoint 2: Cancel an order"""
    current_user_id = get_jwt_identity()
    order = Order.query.get(order_id)
    
    if not order:
        return jsonify({'error': 'Order not found'}), 404
    
    if order.client_id != current_user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    if order.status in ['completed', 'cancelled']:
        return jsonify({'error': 'Cannot cancel a completed or cancelled order'}), 400
    
    order.status = 'cancelled'
    db.session.commit()
    
    return jsonify({'message': 'Order cancelled successfully'}), 200

@orders_bp.route('/<int:order_id>/review', methods=['POST'])
@jwt_required()
def create_review(order_id):
    """POST endpoint for review creation"""
    current_user_id = get_jwt_identity()
    order = Order.query.get(order_id)
    
    if not order:
        return jsonify({'error': 'Order not found'}), 404
    
    if order.client_id != current_user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    if order.status != 'completed':
        return jsonify({'error': 'Can only review completed orders'}), 400
    
    if order.review:
        return jsonify({'error': 'Review already exists for this order'}), 409
    
    data = request.get_json()
    if 'rating' not in data:
        return jsonify({'error': 'Rating required'}), 400
    
    rating = data['rating']
    if not 1 <= rating <= 5:
        return jsonify({'error': 'Rating must be between 1 and 5'}), 400
    
    review = Review(
        order_id=order.id,
        rating=rating,
        comment=data.get('comment', '')
    )
    
    db.session.add(review)
    db.session.commit()
    
    return jsonify({
        'message': 'Review created successfully',
        'review': review.to_dict()
    }), 201
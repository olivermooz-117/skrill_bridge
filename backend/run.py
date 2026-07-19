from app import create_app
from app.extensions import db
from app.models import User, Gig, Order, Review, Tag

app = create_app()

# Create tables if they don't exist (for production)
with app.app_context():
    try:
        print("📊 Checking database tables...")
        db.create_all()
        print("✅ Database tables verified/created successfully!")
    except Exception as e:
        print(f"⚠️ Database issue: {e}")

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
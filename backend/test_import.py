try:
    from flask_cors import CORS
    print("✅ flask_cors imported successfully")
except ImportError as e:
    print(f"❌ Import failed: {e}")
    print("Try: pip install flask-cors")

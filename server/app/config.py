import os
from datetime import timedelta

class ApplicationConfig:
    SECRET_KEY = os.getenv('FLASK_SECRET_KEY')

    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = True
    SQLALCHEMY_DATABASE_URI = f"mysql+pymysql://{os.getenv('DB_USERNAME')}:Marco%25%252003@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/{os.getenv('DB_NAME')}"
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    SESSION_TYPE = 'sqlalchemy'
    SESSION_PERMANENT = True
    PERMANENT_SESSION_LIFETIME = timedelta(days=7)
    SESSION_USE_SIGNER = True
    
    SESSION_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True  
    SESSION_COOKIE_SAMESITE = 'Strict'
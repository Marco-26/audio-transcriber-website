import os
from datetime import timedelta

class ApplicationConfig:
    SECRET_KEY = os.getenv('FLASK_SECRET_KEY')

    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///database.db'

    SESSION_TYPE = 'sqlalchemy'
    SESSION_PERMANENT = True
    PERMANENT_SESSION_LIFETIME = timedelta(days=7)
    SESSION_USE_SIGNER = True
    
    SESSION_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True  
    SESSION_COOKIE_SAMESITE = 'Strict'
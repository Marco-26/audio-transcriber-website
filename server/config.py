import os

class ApplicationConfig:
    SECRET_KEY = os.getenv('FLASK_SECRET_KEY')

    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///database.db'

    SESSION_TYPE = 'sqlalchemy'
    SESSION_PERMANENT = False
    SESSION_USE_SIGNER = True
    
    SESSION_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True  
    SESSION_COOKIE_SAMESITE = 'Strict'
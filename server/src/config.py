import os
from datetime import timedelta

class ApplicationConfig:
    SECRET_KEY = os.getenv('FLASK_SECRET_KEY')

    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = True
    SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://root:marco2003@localhost:33061/transcriptionsdb'
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    SESSION_TYPE = 'sqlalchemy'
    SESSION_PERMANENT = True
    PERMANENT_SESSION_LIFETIME = timedelta(days=7)
    SESSION_USE_SIGNER = True
    
    SESSION_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True  
    SESSION_COOKIE_SAMESITE = 'Strict'
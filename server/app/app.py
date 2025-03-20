from flask import Flask
from flask_migrate import Migrate
from flask_login import LoginManager
from flask_session import Session
from flask_cors import CORS
from openai import OpenAI, OpenAIError
# from transcriber import Transcriber
from .transcriber import Transcriber

import os,pathlib
from apscheduler.schedulers.background import BackgroundScheduler

from .db import db
from .utils import delete_old_files
from .config import ApplicationConfig
from .exceptions.api_error import register_error_handlers

client_secrets_file = os.path.join(pathlib.Path(__file__).parent, "client-secret.json")
data_folder_path = "data"
allowed_users = ['markcostah@gmail.com', 'marcosimoescosta@gmail.com','alloweduser@example.com'] # list of allowed emails to login, simulating beta testing
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")

transcriber = Transcriber(os.getenv("OPENAI_API_KEY"))

def create_app():
  app = Flask(__name__)
  app.config.from_object(ApplicationConfig)
  app.config['SESSION_SQLALCHEMY'] = db

  if not app.config['SECRET_KEY']:
    raise ValueError("No SECRET_KEY set for Flask application. Set it using environment variable.")
  
  db.init_app(app)
  Session(app)

  CORS(app, origins='http://localhost:3000')

  login_manager = LoginManager()
  login_manager.init_app(app)

  from .controllers.auth_controller import auth_bp
  from .controllers.transcription_controller import transcription_bp
  from .controllers.user_controller import user_bp
  
  app.register_blueprint(auth_bp)
  app.register_blueprint(user_bp)
  app.register_blueprint(transcription_bp)
  
  register_error_handlers(app)
  
  Migrate(app,db)

  scheduler = BackgroundScheduler()
  scheduler.add_job(func=delete_old_files, trigger="interval", days=1, args=[app,db])
  scheduler.start()

  return app
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_login import LoginManager
from flask_bcrypt import Bcrypt
from openai import OpenAI, OpenAIError
import os,pathlib
from flask_cors import CORS
from oauthlib.oauth2 import WebApplicationClient
from flask_jwt_extended import create_access_token, JWTManager, jwt_required, get_jwt_identity

db = SQLAlchemy()
data_folder_path = os.path.join(os.path.dirname(__file__), 'data')

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")

secret_key = "TEST" #TODO: CHANGE THIS LATER ON

client_secrets_file = os.path.join(pathlib.Path(__file__).parent, "client-secret.json")

def create_app():
  app = Flask(__name__)
  app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
 
  app.secret_key=secret_key


  # client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
  
  # if client.api_key is None:
  #   raise OpenAIError("OpenAI API key is missing. Set it using OPENAI_API_KEY environment variable.")

  CORS(app, origins='http://localhost:3000')
  jwt = JWTManager(app)

  db.init_app(app)
  login_manager = LoginManager()
  login_manager.init_app(app)

  from models import User

  @login_manager.user_loader
  def load_user(id):
    return User.query.get(id)

  from routes import register_routes
  register_routes(app,db)

  migrate = Migrate(app,db)
  return app
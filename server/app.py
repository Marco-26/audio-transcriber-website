from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from openai import OpenAI, OpenAIError
import os
from flask_cors import CORS

db = SQLAlchemy()

def create_app():
  app = Flask(__name__)
  app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
  client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
  data_folder_path = os.path.join(os.path.dirname(__file__), 'data')
  if client.api_key is None:
    raise OpenAIError("OpenAI API key is missing. Set it using OPENAI_API_KEY environment variable.")

  CORS(app, origins='http://localhost:3000')

  db.init_app(app)

  from routes import register_routes
  register_routes(app,db)

  migrate = Migrate(app,db)
  return app
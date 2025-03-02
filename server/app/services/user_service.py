from ..db import db
from ..models import User

def get_user_by_id(id):
  return User.query.filter_by(id=id).first()

def get_user_by_email(email):
  return User.query.filter_by(email=email).first()

def get_user_count():
  return User.query.count()

def create_user(user_info):
  user = User(user_info["sub"], user_info["name"], user_info["email"],  user_info["picture"])
  db.session.add(user)
  db.session.commit()
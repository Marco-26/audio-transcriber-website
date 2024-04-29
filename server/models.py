from flask_login import UserMixin
from app import db

class User(db.Model, UserMixin):
  __tablename__ = 'users'
  
  id = db.Column(db.Integer, primary_key=True)
  name = db.Column(db.Text, nullable=False)
  email = db.Column(db.Text, nullable=False, unique=True)
  password = db.Column(db.Text, nullable=False)

  def __repr__(self):
    return f'<User:{self.name}>'
  
  def get_id(self):
    return self.id
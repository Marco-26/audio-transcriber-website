from flask_login import UserMixin
from app import db

class User(db.Model, UserMixin):
  __tablename__ = 'users'
  
  id = db.Column(db.Integer, primary_key=True)
  name = db.Column(db.Text, nullable=False)
  email = db.Column(db.Text, nullable=False, unique=True)
  google_id = db.Column(db.Text, nullable=False, unique=True)

  def __init__(self, name, email, google_id):
    self.name = name
    self.email = email
    self.google_id = google_id

  def __repr__(self):
    return f'<User:{self.name}>'
  
  def get_id(self):
    return self.id
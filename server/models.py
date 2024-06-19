from flask_login import UserMixin
from app import db
from datetime import datetime

class User(db.Model, UserMixin):
  __tablename__ = 'users'
  
  id = db.Column(db.Integer, primary_key=True)
  name = db.Column(db.Text, nullable=False)
  email = db.Column(db.Text, nullable=False, unique=True)
  google_id = db.Column(db.Text, nullable=False, unique=True)

  transcriptions = db.relationship('Transcription', backref='user', lazy='dynamic')

  def __init__(self, name, email, google_id):
    self.name = name
    self.email = email
    self.google_id = google_id

  def __repr__(self):
    return f'<User:{self.name}>'
  
  def get_id(self):
    return self.id

class Transcription(db.Model):
  __tablename__ = 'transcriptions'
  
  id = db.Column(db.Integer, primary_key=True)
  user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
  # file_id
  filename = db.Column(db.Text, nullable=False)
  filesize = db.Column(db.Integer, nullable=False)
  date = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

  def __init__(self, user_id, filename):
    self.user_id = user_id
    self.filename = filename

  def __repr__(self):
    return f'<Transcription: {self.id} by User {self.user_id}>'
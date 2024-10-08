from flask_login import UserMixin
from datetime import datetime

from .db import db

class User(db.Model, UserMixin):
  __tablename__ = 'users'
  
  id = db.Column(db.Integer, primary_key=True)
  name = db.Column(db.Text, nullable=False)
  email = db.Column(db.Text, nullable=False, unique=True)
  google_id = db.Column(db.Text, nullable=False, unique=True)
  profile_image_url = db.Column(db.Text, nullable=False)

  files = db.relationship('FileEntry', backref='user', lazy='dynamic')

  def __init__(self, name, email, google_id, profile_image_url):
    self.name = name
    self.email = email
    self.google_id = google_id
    self.profile_image_url = profile_image_url

  def __repr__(self):
    return f'<User:{self.name}>'
  
  def get_id(self):
    return self.id
  
  def to_dict(self):
    return {
        'id': self.google_id,
        'name': self.name,
        'email': self.email,
        'profileImageURL': self.profile_image_url,
    }

class FileEntry(db.Model):
  __tablename__ = 'files'
  
  id = db.Column(db.Integer, primary_key=True)
  user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
  filename = db.Column(db.Text, nullable=False)
  info = db.Column(db.Text, nullable=False)
  date = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
  transcribed = db.Column(db.Boolean, default=False, nullable=False)

  def __init__(self, user_id, filename,file_info):
    self.user_id = user_id
    self.filename = filename
    self.info = file_info
    self.transcribed = False

  def __repr__(self):
    return f'<Transcription: {self.id} by User {self.user_id}>'
  
  def to_dict(self):
    return {
      "file_id": self.id,
      "user_id":self.user_id,
      "filename": self.filename,
      "info": self.info,
      "date": self.date.isoformat(),
      "transcribed":self.transcribed
    }
    
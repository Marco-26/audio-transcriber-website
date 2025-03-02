from sqlalchemy import String
from ..db import db

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(String(255), primary_key=True)
    name = db.Column(String(100), nullable=False)  # Limit the length of the name
    email = db.Column(String(255), nullable=False, unique=True)  # Use VARCHAR for unique fields
    profile_image_url = db.Column(String(500), nullable=False)  # Large enough for image URLs

    # Relationship to FileEntry
    files = db.relationship('FileEntry', backref='user', lazy='dynamic')

    def __init__(self, google_id, name, email, profile_image_url):
        self.id = google_id
        self.name = name
        self.email = email
        self.profile_image_url = profile_image_url

    def __repr__(self):
        return f'<User: {self.name}>'
    
    def get_id(self):
        return self.id
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'profileImageURL': self.profile_image_url,
        }
from sqlalchemy import String
from ..db import db
from datetime import datetime

class FileEntry(db.Model):
    __tablename__ = 'files'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    filename = db.Column(db.String(255), nullable=False)  # Limit filename length for indexing
    unique_filename = db.Column(db.String(255), nullable=False)
    info = db.Column(db.Text, nullable=False)  # Retain TEXT for longer fields without indexing
    date = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    transcribed = db.Column(db.Boolean, default=False, nullable=False)

    def __init__(self, user_id, filename, unique_filename, info):
        self.user_id = user_id
        self.filename = filename
        self.unique_filename = unique_filename
        self.info = info
        self.transcribed = False

    def __repr__(self):
        return f'<Transcription: {self.id} by User {self.user_id}>'
    
    def to_dict(self):
        return {
            "file_id": self.id,
            "user_id": self.user_id,
            "filename": self.filename,
            "info": self.info,
            "date": self.date.isoformat(),
            "transcribed": self.transcribed
        }
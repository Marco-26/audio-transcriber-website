import asyncio
import os

from ..utils import transcribe_audio
from ..models import FileEntry
from ..db import db
from ..app import data_folder_path
from ..services import user_service
from ..services import s3_service
from werkzeug.utils import secure_filename
from flask import jsonify

def get_files_list(filter, user_id):
  if(filter == 'all'):
      files_list = FileEntry.query.filter_by(user_id=user_id).all()
  elif(filter == 'done'):
      files_list = FileEntry.query.filter_by(user_id=user_id, transcribed=True).all()
  return files_list

def get_file_by_id(file_id):
   return FileEntry.query.filter_by(id=file_id).first()

def create_file_entry(user_id, filename, unique_filename, file_info, file_path):
  s3_service.upload(file_path, unique_filename)
  file_entry = FileEntry(user_id=user_id, filename=secure_filename(filename), unique_filename=unique_filename, info=file_info)
  db.session.add(file_entry)
  db.session.commit()
  return file_entry

def delete_file(file:FileEntry):
  if file.transcribed:
    transcribed_filename = file.unique_filename+"-transcribed.txt"
    s3_service.delete_file(transcribed_filename)
  else:
    s3_service.delete_file(file.unique_filename)
      
  db.session.delete(file)
  db.session.commit()

async def transcribe_and_save(file_path:str, file_entry:FileEntry):
  if not os.path.exists(file_path):
    raise FileNotFoundError("Audio file not found")

  try:
    transcript = await asyncio.to_thread(transcribe_audio, file_path)

    if not transcript:
        raise ValueError("Transcription failed, no transcript generated.")
    
    transcription_file_name = file_entry.unique_filename+"-transcribed.txt"
    transcript_file_path = file_path + transcription_file_name
    with open(transcript_file_path, 'w') as temp_file:
        temp_file.write(transcript)
        temp_file.flush()
    
    s3_service.upload(transcript_file_path,transcription_file_name)
    s3_service.delete_file(file_entry.unique_filename)
    os.remove(file_path)
    os.remove(transcript_file_path)
    
    file_entry.transcribed = True
    db.session.add(file_entry)
    db.session.commit()

  except Exception as e:
    print(f"Error during transcription: {str(e)}")
    raise e

def validate_user_and_file(user_id, file_id):
  user = user_service.get_user_by_id(user_id)
  if not user:
      return jsonify(error="User not found"), 404, None, None, None

  file_entry = get_file_by_id(file_id)
  if not file_entry:
      return jsonify(error="File entry not found in the database"), 404, None, None, None

  if file_entry.user_id != user.id:
      return jsonify(error="The file doesn't belong to this user"), 403, None, None, None

  file_path = s3_service.download(file_entry.unique_filename)
  print(file_path)
  if not file_path:
      return jsonify(error="File not found"), 404, None, None, None
  return None, None, user, file_path, file_entry
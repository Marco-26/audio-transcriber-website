import asyncio
import os

from ..utils import transcribe_audio
from ..models import FileEntry
from ..db import db
from ..services import user_service
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

def create_file_entry(user_id, filename, unique_filename, file_info):
  file_entry = FileEntry(user_id=user_id, filename=secure_filename(filename), unique_filename=unique_filename, info=file_info)
  db.session.add(file_entry)
  db.session.commit()
  return file_entry

def delete_file(file):
  db.session.delete(file)
  db.session.commit()

async def transcribe_and_save(file, data_folder_path):
  file_path = os.path.join(data_folder_path, file.unique_filename)

  if not os.path.exists(file_path):
      raise FileNotFoundError("Audio file not found")

  try:
      transcript = await asyncio.to_thread(transcribe_audio, file_path)

      if not transcript:
          raise ValueError("Transcription failed, no transcript generated.")

      transcript_file_path = file_path + "-transcribed.txt"
      with open(transcript_file_path, 'w') as temp_file:
          temp_file.write(transcript)
          temp_file.flush()

      os.remove(file_path)

      file.transcribed = True
      db.session.add(file)
      db.session.commit()

      return transcript_file_path
  except Exception as e:
      print(f"Error during transcription: {str(e)}")
      raise e

def validate_user_and_file(user_id, file_id):
  user = user_service.get_user_by_id(user_id)
  if not user:
      return jsonify(error="User not found"), 404, None, None

  file = get_file_by_id(file_id)
  if not file:
      return jsonify(error="File not found"), 404, None, None

  if file.user_id != user.id:
      return jsonify(error="The file doesn't belong to this user"), 403, None, None

  return None, None, user, file
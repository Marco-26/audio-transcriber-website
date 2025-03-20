from pathlib import Path
import asyncio
import os
import shutil
from functools import wraps
from flask import Blueprint, jsonify, request, session

from ..exceptions.api_error import APIAuthError, APIBadRequestError, APINotFoundError
from ..app import data_folder_path, allowed_users, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
from ..models import User, FileEntry
from ..utils import MAX_FILES_USER, save_file, get_file_info, convert_to_wav_and_save, generate_unique_filename
from ..db import db
from ..services import auth_service, transcription_service, user_service, s3_service
transcription_bp = Blueprint('transcription_bp', __name__)

def login_required(f):
  @wraps(f)
  def decorated_function(*args, **kwargs):
    if 'user_id' not in session:
      raise APIAuthError("Unauthorized Access")
    if 'user_id' in kwargs and kwargs['user_id'] != str(session['user_id']):
      raise APIAuthError("Access denied to another user's data")
    return f(*args, **kwargs)
  return decorated_function

@transcription_bp.route("/files/<user_id>", methods=['GET'])
@login_required
def fetch_file_entries(user_id):
    user = user_service.get_user_by_id(user_id)
    if not user:
      raise APINotFoundError("User not found")

    filter = request.args.get("filter", "all")

    files_list = transcription_service.get_files_list(filter, user.id)

    files = [t.to_dict() for t in files_list] if files_list else []

    return jsonify(success=True, message="Fetched all files", payload=files), 200

@transcription_bp.route("/files/upload", methods=['POST'])
@login_required
def upload_endpoint():
    if 'file' not in request.files:
      raise APIBadRequestError("No file provided")

    user_id = session["user_id"]
    received_file = request.files['file']

    user = user_service.get_user_by_id(user_id)
    if not user:
      raise APINotFoundError("User not found")
    
    files = user.files.all()
    if len(files) >= MAX_FILES_USER:
      raise APIBadRequestError("User reached the maximum file limit.")

    unique_filename = generate_unique_filename(received_file)
    file_path = os.path.join(data_folder_path, unique_filename)

    #guardar temporariamente
    received_file.save(file_path)
    file_info = get_file_info(file_path)
    
    file_entry = transcription_service.create_file_entry(user.id, received_file.filename, unique_filename, file_info, file_path)

    os.remove(file_path) #remove ficheiro do servidor porque vai ser guardado no bucket s3

    return jsonify(success=True, message="File uploaded sucessfuly", payload=file_entry.to_dict()), 200 

@transcription_bp.route("/files/<user_id>/<file_id>/transcribe", methods=['POST'])
@login_required
def transcript_endpoint(user_id, file_id):
  user:User = user_service.get_user_by_id(user_id)
  if not user:
    raise APINotFoundError("User not found")

  file_entry:FileEntry = transcription_service.get_file_by_id(file_id)
  if not file_entry:
    raise APINotFoundError("File entry not found in the database")
  
  if file_entry.user_id != user.id:
    raise APIAuthError("The file doesn't belong to this user")

  if file_entry.transcribed:
    raise APIBadRequestError("File already transcribed")
  
  file_path = s3_service.download(file_entry.unique_filename)
  if not file_path:
    raise APINotFoundError("File entry not found in storage")
  
  asyncio.run(transcription_service.transcribe_and_save(file_path, file_entry))
  return jsonify(success=True, message="Finished transcribing the audio"), 200

@transcription_bp.route("/files/<user_id>/<file_id>/transcription", methods=['GET'])
@login_required
def fetch_transcribed_audio(user_id,file_id):
  user = user_service.get_user_by_id(user_id)
  if not user:
    raise APINotFoundError("User not found")
  
  file_entry:FileEntry = transcription_service.get_file_by_id(file_id)
  if not file_entry:
    raise APINotFoundError("File entry not found in the database")
  
  transcribed_filename = file_entry.unique_filename+"-transcribed.txt"
  file_path = s3_service.download(transcribed_filename)
  if not file_path:
    raise APINotFoundError("File entry not found in storage")
  
  if(os.path.isfile(file_path)):
    with open(file_path, 'r') as file:
      file_contents = file.read()
    return jsonify(success=True, message="Finished fetching transcription...", payload=file_contents,), 200
  
  raise APINotFoundError("Transcription not found")

@transcription_bp.route("/files/<file_id>", methods=['DELETE'])
@login_required
def delete_endpoint(file_id):
  file_entry:FileEntry = transcription_service.get_file_by_id(file_id)
  if not file_entry:
    raise APINotFoundError("File entry not found in the database")

  transcription_file_name = data_folder_path+'/'+file_entry.unique_filename + '-transcribed.txt'
  transcription_service.delete_file(file_entry)

  if os.path.exists(file_entry.unique_filename):
    os.remove(file_entry.unique_filename)
  if os.path.exists(transcription_file_name):
    os.remove(transcription_file_name)

  return jsonify(success=True, message=f"Successfully deleted the file or directory with id: {id}"), 200
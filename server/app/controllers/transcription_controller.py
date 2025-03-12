from pathlib import Path
import shutil
import asyncio
import os
import shutil
from functools import wraps
from pathlib import Path
import io
from flask import Blueprint, jsonify, request, session
from openai import APIError

from ..exceptions.api_error import APINotFoundError
from ..app import data_folder_path, allowed_users, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
from ..models import User, FileEntry
from ..utils import MAX_FILES_USER, save_file, transcribe_audio, get_file_info, convert_to_wav_and_save, generate_unique_filename
from ..db import db
from ..services import auth_service, transcription_service, user_service, s3_service
transcription_bp = Blueprint('transcription_bp', __name__)

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify(success=False, error="Unauthorized access."), 401
        return f(*args, **kwargs)
    return decorated_function

@transcription_bp.route("/files/<user_id>", methods=['GET'])
@login_required
def fetch_file_entries(user_id):
    user = user_service.get_user_by_id(user_id)
    if not user:
        return jsonify(success=False, error="The requested user does not exist in the system."),404

    filter = request.args.get("filter", "all")

    files_list = transcription_service.get_files_list(filter, user.id)

    files = [t.to_dict() for t in files_list] if files_list else []

    return jsonify(success=True, message="Fetched all files", payload=files), 200

@transcription_bp.route("/files/upload", methods=['POST'])
@login_required
def upload_endpoint():
    if 'file' not in request.files:
        return jsonify(success=False, error="No file provided"), 400
    elif 'user_id' not in request.form:
        return jsonify(success=False, error="No user_id provided"), 400
    
    user_id = request.form["user_id"]
    received_file = request.files['file']

    user = user_service.get_user_by_id(user_id)
    if not user:
        return jsonify(success=False, error='User not found'), 404
    
    files = user.files.all()
    if len(files) >= MAX_FILES_USER:
        return jsonify(success=False, error='User reached the maximum file limit.'), 400

    unique_filename = generate_unique_filename(received_file)
    file_path = os.path.join(data_folder_path, unique_filename)

    #guardar temporariamente
    received_file.save(file_path)
    file_info = get_file_info(file_path)
    
    file_entry = transcription_service.create_file_entry(user.id, received_file.filename, unique_filename, file_info, file_path)

    os.remove(file_path) #remove ficheiro do servidor porque vai ser guardado no bucket s3

    return jsonify(success=True, message="File uploaded sucessfuly", payload=file_entry.to_dict()), 200 

@transcription_bp.route("/files/<user_id>/<file_id>/transcribe", methods=['POST'])
# @login_required 
def transcript_endpoint(user_id, file_id):
  try:
    file_path, file_entry = transcription_service.validate_user_and_file(user_id, file_id)
    asyncio.run(transcription_service.transcribe_and_save(file_path, file_entry))
    return jsonify(success=True, message="Finished transcribing the audio"), 200
  except APIError as e:
    return jsonify(error=e.description, message=str(e)), e.code

@transcription_bp.route("/files/<user_id>/<file_id>/transcription", methods=['GET'])
@login_required
def fetch_transcribed_audio(user_id,file_id):
    file = transcription_service.get_file_by_id(file_id)
    # error_response, status_code, user, file_path, file_entry = transcription_service.validate_user_and_file(user_id, file_id)
    # if error_response:
    #     return error_response, status_code

    transcribed_filename = file.unique_filename + '-transcribed.txt'
    print("Ficheiro a ser descarregado: " + transcribed_filename)
    file_path = transcription_service.get_transcribed_audio(transcribed_filename)

    if(os.path.isfile(file_path)):
        with open(file_path, 'r') as file:
            file_contents = file.read()
        return jsonify(success=True, message="Finished fetching transcription...", payload=file_contents,), 200
    else:
        return jsonify(success=False, error="Transcription not found."), 404

@transcription_bp.route("/files/<id>", methods=['DELETE'])
@login_required
def delete_endpoint(id):
    file = transcription_service.get_file_by_id(id)
    if not file:
        return jsonify(success=False, error=f"File with id {id} not found."), 404

    transcription_file_name = data_folder_path+'/'+file.unique_filename + '-transcribed.txt'
    try:
        transcription_service.delete_file(file)

        if os.path.exists(file.unique_filename):
            os.remove(file.unique_filename)
        if os.path.exists(transcription_file_name):
            os.remove(transcription_file_name)
    except Exception as e:
        print(f"Error: {e}")
        return jsonify(success=False, error="There was an error deleting the file."), 500

    return jsonify(success=True, message=f"Successfully deleted the file or directory with id: {id}"), 200
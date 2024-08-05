import json
from pathlib import Path
import shutil
from flask import  abort, jsonify, request,session
from models import User, FileEntry
import os
from utils import temp_save_file, transcribe_audio,get_file_info
from app import data_folder_path, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
import requests
from flask_jwt_extended import create_access_token
from werkzeug.utils import secure_filename
from functools import wraps
import asyncio

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({"error": "Unauthorized. Please log in."}), 401
        return f(*args, **kwargs)
    return decorated_function

def register_routes(app, db):
    @app.route('/google_login', methods=['POST'])
    def login():
        auth_code = request.get_json()['code']

        data = {
            'code': auth_code,
            'client_id': GOOGLE_CLIENT_ID,  # client ID from the credential at google developer console
            'client_secret': GOOGLE_CLIENT_SECRET,  # client secret from the credential at google developer console
            'redirect_uri': 'postmessage',
            'grant_type': 'authorization_code'
        }

        response = requests.post('https://oauth2.googleapis.com/token', data=data).json()
        headers = {
            'Authorization': f'Bearer {response["access_token"]}'
        }
        user_info = requests.get('https://www.googleapis.com/oauth2/v3/userinfo', headers=headers).json()
        
        user = User.query.filter_by(email = user_info["email"]).first()
        
        if not user:
            user = User(user_info["name"], user_info["email"], user_info["sub"], user_info["picture"])
            db.session.add(user)
            db.session.commit()

        session["user_id"] = user.google_id
        response = jsonify(user=user.to_dict())
        
        return response, 200

    @app.route("/@me",methods=['GET'])
    def get_current_user():
        user_id = session.get("user_id")
        
        if not user_id:
            return jsonify({"error": "Unauthorized"})

        user = User.query.filter_by(google_id=user_id).first()
        return jsonify(user=user.to_dict())

    @app.route("/api/entries/<user_id>/<filter>", methods=['GET'])
    @login_required
    def get_file_entries(user_id,filter):
        user_exists = User.query.filter_by(google_id=user_id).first()
        if not user_exists:
            return jsonify(error='User not found')
        
        if(filter == 'all'):
            files_list = FileEntry.query.filter_by(user_id=user_id).all()
        elif(filter == 'done'):
            files_list = FileEntry.query.filter_by(user_id=user_id, transcribed=True).all()

        if not files_list:
            return jsonify(error='No files found for this user')

        files = [t.to_dict() for t in files_list]

        return jsonify(files=files, message="Fetched all files")

    @app.route("/api/upload", methods=['POST'])
    @login_required
    def upload_endpoint():
        if 'file' not in request.files:
            return jsonify(error="No file provided"), 400
        elif 'user_id' not in request.form:
            return jsonify(error="No user_id provided"), 400
        
        user_id = request.form["user_id"]
        file = request.files['file']
        user_exists = User.query.filter_by(google_id=user_id).first()
        
        if not user_exists:
            return jsonify(error='User not found')
        
        file_info = get_file_info(file)

        file_entry = FileEntry(user_id=user_id, filename=secure_filename(file.filename), file_info=file_info)
        db.session.add(file_entry)
        db.session.commit()

        file_id = file_entry.id
        file_path=f"{data_folder_path}/{file_id}"
        
        os.makedirs(file_path)
        temp_save_file(file_path, secure_filename(file.filename), file)
        
        return jsonify(message="File uploaded sucessfuly", fileEntry=file_entry.to_dict())
    
    @app.route("/api/transcript/<user_id>/<file_id>/<filename>", methods=['POST'])
    @login_required
    def transcript_endpoint(user_id, file_id, filename):
        file = FileEntry.query.filter_by(id=file_id).first()
        
        # if file.user_id != user_id:
        #     return jsonify(message="Unauthorized"), 401
        
        file_path = os.path.join(data_folder_path, file_id, filename)

        async def transcribe_and_save(file_path, file_id):
            transcript = await transcribe_audio(file_path)
            
            transcript_file_path = Path(data_folder_path) / file_id / "transcript.txt"
            with open(transcript_file_path, 'w') as temp_file:
                temp_file.write(transcript)

            file.transcribed = True
            db.session.add(file)
            db.session.commit()

        asyncio.run(transcribe_and_save(file_path, file_id))

        return jsonify(message="Finished Transcribing the audio")

    
    @app.route("/api/transcription/<file_id>", methods=['GET'])
    @login_required
    def fetch_transcribed_audio(file_id):
        file = FileEntry.query.filter_by(id=file_id).first()
        file_path = os.path.join(data_folder_path, file_id,"transcript.txt")
        
        if(os.path.isfile(file_path)):
            with open(file_path, 'r') as file:
                file_contents = file.read()
            return jsonify(transcription=file_contents, message="Finished fetching transcription...")
        else:
            return jsonify(message="Transcription not found."), 404


    
    @app.route("/api/delete/<id>", methods=['DELETE'])
    @login_required
    def delete_endpoint(id):
        directory_path = os.path.join(data_folder_path, id)
        try:
            if os.path.isdir(directory_path):
                file_entry = FileEntry.query.filter_by(id=id).first()
                db.session.delete(file_entry)
                db.session.commit()
                shutil.rmtree(directory_path)
            else:
                os.remove(directory_path)
        except Exception as e:
            print(f"Error: {e}")
            return jsonify(error="There was an error deleting the file or directory."), 500

        return jsonify(message=f"Successfully deleted the file or directory with id: {id}"), 200
    
    @app.route("/logout", methods=["POST"])
    def logout_user():
        session.pop("user_id")
        return "200"

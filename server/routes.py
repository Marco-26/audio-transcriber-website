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

BACKEND_URL = "https://127.0.0.1:5000"
FRONTEND_URL = "http://localhost:3000" 

def login_required(function):
    def wrapper(*args, **kwargs):
        encoded_jwt=request.headers.get("Authorization").split("Bearer ")[1]
        if encoded_jwt==None:
            return abort(401)
        else:
            return function()
    return wrapper

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
        print(user_info)
        user = User.query.filter_by(email = user_info["email"]).first()
        if not user:
            print("Added new user to the database")
            user = User(user_info["name"], user_info["email"], user_info["sub"], user_info["picture"])
            db.session.add(user)
            db.session.commit()

        user_data = {
            'google_id': user.google_id,
            'name': user.name,
            'email': user.email,
            'profileImageURL': user.profile_image_url
        }

        session["user"] = user_data

        jwt_token = create_access_token(identity=user_info['email'])
        response = jsonify(user=user_info)
        response.set_cookie('access_token_cookie', value=jwt_token, secure=True)
        
        return response, 200

    @app.route("/@me",methods=['GET'])
    def get_current_user():
        user = session.get("user")
        
        if not user:
            return jsonify({"error": "Unauthorized"})
        print(user)
        user_data = {
            'id': user["google_id"],
            'name': user["name"],
            'email': user["email"],
            'profileImageURL': user["profileImageURL"],
        }

        return jsonify(user=user_data)

    @app.route("/api/entries/<user_id>/<filter>", methods=['GET'])
    def get_file_entries(user_id,filter):
        print("USER ID: " + user_id + "; Filter: " + filter)
        user_exists = User.query.filter_by(google_id=user_id).first()
        if not user_exists:
            return jsonify(error='User not found')
        files_list = FileEntry.query.filter_by(user_id=user_id).all()

        if not files_list:
            return jsonify(error='No files found for this user')

        files = [{
            'file_id': t.id,
            'user_id': t.user_id,
            'filename': t.filename,
            'info':t.info,
            'date':t.date,
            'transcribed': t.transcribed
        } for t in files_list]

        return jsonify(files=files, message="Fetched all files")

    @app.route("/api/upload", methods=['POST'])
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
        
        fileEntry = {
            "file_id": file_entry.id,
            "user_id":file_entry.user_id,
            "filename": file_entry.filename,
            "info": file_entry.info,
            "date": file_entry.date.isoformat(),
            "transcribed":file_entry.transcribed
        }
        
        return jsonify(message="File uploaded sucessfuly", fileEntry=fileEntry)
    
    @app.route("/api/transcript/<file_id>/<filename>", methods=['POST'])
    async def transcript_endpoint(file_id,filename):
        file = FileEntry.query.filter_by(id=file_id).first()
        file_path = os.path.join(data_folder_path, file_id,filename)
        
        transcript = await transcribe_audio(file_path)
        
        transcript_file_path = Path(data_folder_path+"/"+file_id) / "transcript.txt"
        with open(transcript_file_path, 'w') as temp_file:
            temp_file.write(transcript)

        file.transcribed = True
        db.session.add(file)
        db.session.commit()

        return jsonify(message="Finished Transcribing the audio")
    
    @app.route("/api/transcription/<file_id>", methods=['GET'])
    async def fetch_transcribed_audio(file_id):
        file = FileEntry.query.filter_by(id=file_id).first()
        file_path = os.path.join(data_folder_path, file_id,"transcript.txt")
        
        if(os.path.isfile(file_path)):
            with open(file_path, 'r') as file:
                file_contents = file.read()

        return jsonify(transcription=file_contents, message="Finished fetching transcription...")
    
    @app.route("/api/delete/<id>", methods=['DELETE'])
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
        session.pop("user")
        return "200"

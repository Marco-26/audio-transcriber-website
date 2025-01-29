from pathlib import Path
import shutil
import asyncio
import os
import shutil
from functools import wraps
from pathlib import Path
import requests
from flask import jsonify, request, session
from werkzeug.utils import secure_filename

from .app import data_folder_path, allowed_users, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
from .models import User, FileEntry
from .utils import MAX_FILES_USER, save_file, transcribe_audio, get_file_info, convert_to_wav_and_save, generate_unique_filename


def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify(error="Unauthorized access."), 401
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
       
        if 'access_token' not in response:
            return jsonify(error="OAuth token exchange failed"), 401

        headers = {
            'Authorization': f'Bearer {response["access_token"]}'
        }
        user_info = requests.get('https://www.googleapis.com/oauth2/v3/userinfo', headers=headers).json()

        if user_info["email"] not in allowed_users:
            return jsonify(error="Unauthorized"), 401

        user = User.query.filter_by(email = user_info["email"]).first()
        
        if not user:
            user = User(user_info["name"], user_info["email"], user_info["sub"], user_info["picture"])
            db.session.add(user)
            db.session.commit()

        session["user_id"] = user.google_id
        
        return jsonify(user=user.to_dict()), 200

    @app.route("/@me",methods=['GET'])
    def get_current_user():
        user_id = session.get("user_id")
        
        if not user_id:
            return jsonify(error="User not found"), 404

        user = User.query.filter_by(google_id=user_id).first()
        return jsonify(user=user.to_dict()), 200

    @app.route("/api/entries/<user_id>/<filter>", methods=['GET'])
    @login_required
    def fetch_file_entries(user_id,filter):
        user = User.query.filter_by(google_id=user_id).first()
        if not user:
            return jsonify(error='User not found'), 404
        
        if(filter == 'all'):
            files_list = FileEntry.query.filter_by(user_id=user.id).all()
        elif(filter == 'done'):
            files_list = FileEntry.query.filter_by(user_id=user.id, transcribed=True).all()

        if not files_list:
            return jsonify(error='No files found for this user')

        files = [t.to_dict() for t in files_list]

        return jsonify(files=files, message="Fetched all files"), 200

    @app.route("/api/upload", methods=['POST'])
    @login_required
    def upload_endpoint():
        if 'file' not in request.files:
            return jsonify(error="No file provided"), 400
        elif 'user_id' not in request.form:
            return jsonify(error="No user_id provided"), 400
        
        user_id = request.form["user_id"]
        received_file = request.files['file']

        user = User.query.filter_by(google_id=user_id).first()
        
        if not user:
            return jsonify(error='User not found'), 404
        
        files = user.files.all()
        if len(files) >= MAX_FILES_USER:
            return jsonify(error='User reached the maximum file limit.'), 400

        unique_filename = generate_unique_filename(received_file)
        path = convert_to_wav_and_save(received_file, unique_filename)
        
        file_info = get_file_info(path)
        
        file_entry = FileEntry(user_id=user.id, filename=secure_filename(received_file.filename), unique_filename=unique_filename, info=file_info)
        db.session.add(file_entry)
        db.session.commit()
        
        return jsonify(message="File uploaded sucessfuly", fileEntry=file_entry.to_dict()), 200
    
    @app.route("/api/transcript/<user_id>/<file_id>", methods=['POST'])
    @login_required 
    def transcript_endpoint(user_id, file_id):
        file = FileEntry.query.filter_by(id=file_id).first()
        if not file:
            return jsonify(error='File not found'), 404
        print("File owner id: " + str(file.user_id))

        user = User.query.filter_by(google_id = user_id).first()
        if not user:
            return jsonify(error='User not found'), 404
        
        if file.user_id != user.id:
            return jsonify(error="Unauthorized: The uploaded file does not belong to this user."), 401

        file_path = os.path.join(data_folder_path, file.unique_filename)

        if not os.path.exists(file_path):
            return jsonify(error='Audio file not found'), 404

        async def transcribe_and_save(file_path):
            try:
                transcript = await asyncio.to_thread(transcribe_audio, file_path)
                
                if not transcript:
                    raise ValueError("Transcription failed, no transcript generated.")
                
                transcript_file_path = file_path + "-transcribed.txt"
                with open(transcript_file_path, 'w') as temp_file:
                    temp_file.write(transcript)
                    temp_file.flush()

                file.transcribed = True
                db.session.add(file)
                db.session.commit()
            except Exception as e:
                print(f"Error during transcription: {str(e)}")
                raise e

        try:
            asyncio.run(transcribe_and_save(file_path))
        except Exception as e:
            print(f"Unexpected error: {str(e)}")
            return jsonify(error="An unexpected error occurred. Failed to transcribe audio"), 500

        return jsonify(message="Finished transcribing the audio"), 200

    @app.route("/api/transcription/<file_id>", methods=['GET'])
    @login_required
    def fetch_transcribed_audio(file_id):
        file = FileEntry.query.filter_by(id=file_id).first()
        if not file:
            return jsonify(error='File not found'), 404
        transcription_file_name = file.unique_filename + '-transcribed.txt'
        file_path = os.path.join(data_folder_path, transcription_file_name)
        
        if(os.path.isfile(file_path)):
            with open(file_path, 'r') as file:
                file_contents = file.read()
            return jsonify(transcription=file_contents, message="Finished fetching transcription..."), 200
        else:
            return jsonify(error="Transcription not found."), 404

    @app.route("/api/delete/<id>", methods=['DELETE'])
    @login_required
    def delete_endpoint(id):
        directory_path = os.path.join(data_folder_path, id)
        try:
            file_entry = FileEntry.query.filter_by(id=id).first()
            if file_entry:
                db.session.delete(file_entry)
                db.session.commit()
            if os.path.isdir(directory_path):
                shutil.rmtree(directory_path)
        except Exception as e:
            print(f"Error: {e}")
            return jsonify(error="There was an error deleting the file or directory."), 500

        return jsonify(message=f"Successfully deleted the file or directory with id: {id}"), 200
    
    @app.route("/api/fetchRegisteredUsers",methods=['GET'])
    def fetch_registered_users():
        registered_users = User.query.count()
        return jsonify(registered_users=registered_users), 200
    
    @app.route("/logout", methods=["POST"])
    def logout_user():
        session.pop("user_id")
        return "200"

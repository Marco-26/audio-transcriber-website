import json
from flask import  abort, jsonify, request,redirect, url_for
from models import User, FileEntry
import os
from utils import temp_save_file
from app import data_folder_path, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
import requests
from flask_jwt_extended import create_access_token

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
        
        user = User.query.filter_by(email = user_info["email"]).first()
        if not user:
            print("Added new user to the database")
            user = User(user_info["name"], user_info["email"], user_info["sub"])
            db.session.add(user)
            db.session.commit()

        jwt_token = create_access_token(identity=user_info['email'])  # create jwt token
        response = jsonify(user=user_info)
        response.set_cookie('access_token_cookie', value=jwt_token, secure=True)

        return response, 200
    
    @app.route("/api/entries", methods=['POST'])
    def get_file_entries():
        if 'user_id' not in request.form:
            return jsonify(error="No user_id provided"), 400

        user_id = request.form["user_id"]
        files_list = FileEntry.query.filter_by(user_id=user_id)

        files = [{
            'file_id': t.id,
            'user_id': t.user_id,
            'filename': t.filename,
            'filesize':t.filesize,
            'date':t.date
        } for t in files_list]

        return jsonify(files=files, message="File uploaded sucessfuly")

    @app.route("/api/upload", methods=['POST'])
    def upload_endpoint():
        if 'file' not in request.files:
            return jsonify(error="No file provided"), 400
        elif 'user_id' not in request.form:
            return jsonify(error="No user_id provided"), 400

        file = request.files['file']

        user_id = request.form["user_id"]
        
        file_entry = FileEntry(user_id=user_id, filename=file.filename, filesize=10)
        db.session.add(file_entry)
        db.session.commit()

        file_id = file_entry.get_id()
        file_path=f"{data_folder_path}/{file_id}"
        
        os.makedirs(file_path)
        temp_save_file(file_path, file.filename, file)

        file_info = {
            "id": file_entry.get_id(),
            "filename": file_entry.get_filename(),
            "filesize": file_entry.get_filesize(),
            "date": file_entry.get_date().isoformat(),
        }
        
        return jsonify(message="File uploaded sucessfuly", file_info=file_info)
    
    @app.route("/api/transcript", methods=['POST'])
    async def transcript_endpoint():
        data = request.get_json()
        filename = data.get('filename')
        file = os.path.join(data_folder_path, filename)

        #transcript = await transcribe_audio(file)

        os.remove(file)
        return transcript
    
    @app.route("/api/delete/<filename>", methods=['DELETE'])
    def delete_endpoint(filename):
        print("Nome do ficheiro: " + filename)
        try:
            os.remove(data_folder_path+"/"+filename)
        except Exception as e:
            return jsonify(error="There was an error deleting the file...")

        return jsonify(message="Sucessfully deleted the file")

from flask import  jsonify, request,redirect
from models import User
import os
from utils import temp_save_file
from app import data_folder_path, auth_client 
from flask_login import login_user,logout_user, current_user,login_required
import requests

def register_routes(app, db, bcrypt):
    @app.route("/login", methods=['GET', 'POST'])
    def login():
        # Find out what URL to hit for Google login
        google_provider_cfg = get_google_provider_cfg()
        authorization_endpoint = google_provider_cfg["authorization_endpoint"]

        # Use library to construct the request for Google login and provide
        # scopes that let you retrieve user's profile from Google
        request_uri = auth_client.prepare_request_uri(
            authorization_endpoint,
            redirect_uri=request.base_url + "/callback",
            scope=["openid", "email", "profile"],
        )
        return redirect(request_uri)
    
    @app.route("/signup", methods=['POST'])
    def signup():
        email = request.json['email']
        password = request.json['password']
        confirmPassword = request.json['confirmPassword']
        name = request.json['name']

        email_exists = User.query.filter_by(email=email).first()
        
        if email_exists:
            return jsonify(error="Email already in use")
        elif password != confirmPassword:
            return jsonify(error="Passwords don't match")
        elif len(name) < 4:
            return jsonify(error="Username is too short")
        elif len(password) < 6:
            return jsonify(error="Password is too short")
        elif len(email) < 4:
            return jsonify(error="Email is too short")

        hashed_password = bcrypt.generate_password_hash(password)

        new_user = User(email=email, password=hashed_password,name=name)
        db.session.add(new_user)
        db.session.commit()

        login_user(new_user, remember=True)

        return jsonify({
            "id":new_user.id,
            "name":new_user.name,
            "email":new_user.email
        })

    @app.route("/logout", methods=['POST'])
    @login_required
    def logout():
        logout_user()
        return jsonify(message="Logged out")
    
    @app.route("/api/upload", methods=['POST'])
    def upload_endpoint():
        if 'file' not in request.files:
            return jsonify(error="No file provided"), 400

        file = request.files['file']
        temp_save_file(data_folder_path, file.filename, file)

        return jsonify(message="File uploaded sucessfuly")
    
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
    

def get_google_provider_cfg():
    GOOGLE_DISCOVERY_URL = (
        "https://accounts.google.com/.well-known/openid-configuration"
    )
    return requests.get(GOOGLE_DISCOVERY_URL).json()
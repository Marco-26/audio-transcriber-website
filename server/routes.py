from flask import  jsonify, request
from models import User
import os
from utils import temp_save_file
from app import data_folder_path 
from flask_login import login_user,logout_user, current_user,login_required

def register_routes(app, db, bcrypt):
    @app.route("/login", methods=['POST'])
    def login():
        email = request.json['email']
        password = request.json['password']

        if not email or not password:
            return jsonify(error="Please insert your email and password"),400

        user = User.query.filter(User.email==email).first()

        if not user:
            return jsonify(error="Unathorized"), 401

        if not bcrypt.check_password_hash(user.password, password):
            return jsonify(error="Passwords don't match"), 401
 
        login_user(user)

        return jsonify({
            "id":user.id,
            "name":user.name,
            "email":user.email
        })
    
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
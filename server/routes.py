from flask import  jsonify, request
from models import User
import os
from utils import temp_save_file
from app import data_folder_path 


def register_routes(app, db):
    @app.route("/login", methods=['POST'])
    def login():
        email = request.json['email']
        password = request.json['password']

        if not email or not password:
            return jsonify(error="Please insert your email and password"),400

        user = User.query.filter_by(email=email).first()
        if not user:
            return jsonify(error="Unathorized"), 401

        if user.password != password:
            return jsonify(error="Unathorized"), 401

        return jsonify({
            "id":user.id,
            "name":user.name,
            "email":user.email
        })

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
from flask import  jsonify, request
from models import User
import os
from utils import temp_save_file

def register_routes(app, db):
    @app.route("/api/upload", methods=['POST'])
    def upload_endpoint(self):
        if 'file' not in request.files:
            return jsonify(error="No file provided"), 400

        file = request.files['file']
        temp_save_file(self.data_folder_path, file.filename, file)

        return jsonify(message="File uploaded sucessfuly")
    
    @app.route("/api/transcript", methods=['POST'])
    async def transcript_endpoint(self):
        data = request.get_json()
        filename = data.get('filename')
        file = os.path.join(self.data_folder_path, filename)

        transcript = await self.transcribe_audio(file)

        os.remove(file)
        return transcript
    
    @app.route("/api/delete/<filename>", methods=['DELETE'])
    def delete_endpoint(self, filename):
        print("Nome do ficheiro: " + filename)
        try:
            os.remove(self.data_folder_path+"/"+filename)
        except Exception as e:
            return jsonify(error="There was an error deleting the file...")

        return jsonify(message="Sucessfully deleted the file")
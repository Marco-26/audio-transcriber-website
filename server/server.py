from flask import Flask, jsonify, request
from flask_cors import CORS
from openai import OpenAI, OpenAIError
import os
from utils import temp_save_file
import subprocess
import base64

from transcribe import transcribe_single_chunk, split_audio, get_file_size, generate_chunk_files, transcribe_multiple_chunks

class Server:
    def __init__(self):
        self.app = Flask(__name__)
        self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        self.data_folder_path = os.path.join(os.path.dirname(__file__), 'data')

        CORS(self.app, origins='http://localhost:3000')

        if self.client.api_key is None:
            raise OpenAIError("OpenAI API key is missing. Set it using OPENAI_API_KEY environment variable.")

        self.app.route('/api/upload', methods=['POST'])(self.upload_endpoint)
        self.app.route('/api/transcript', methods=['POST'])(self.transcript_endpoint)
    
    def upload_endpoint(self):
        if 'file' not in request.files:
            return jsonify(error="No file provided"), 400

        file = request.files['file']
        temp_save_file(self.data_folder_path, file.filename, file)

        return jsonify(message="File uploaded sucessfuly")

    async def transcript_endpoint(self):
        data = request.get_json()
        filename = data.get('filename')
        file = os.path.join(self.data_folder_path, filename)

        transcript = await self.transcribe_audio(file)

        os.remove(file)
        return transcript
    
    async def transcribe_audio(self, file):
        try:
            process = subprocess.Popen(['python', 'transcribe.py', file], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            stdout, stderr = process.communicate()
            
            if process.returncode == 0:
                #TODO: FIND A BETTER WAY TO DO THIS
                output = stdout.decode().strip()
                return output
            else:
                error_message = stderr.decode().strip()
                return jsonify({'error': error_message}), 500

        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
if __name__ == '__main__':
    server = Server()
    server.app.run(debug=True)

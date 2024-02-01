from flask import Flask, jsonify, request
from flask_cors import CORS
from openai import OpenAI, OpenAIError
import os
from utils import temp_save_file

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
        return transcript.text
    
    async def transcribe_audio(self, file):
        with open(file, "rb") as audio_to_transcribe:
            transcript = self.client.audio.transcriptions.create(
                model="whisper-1", 
                file=audio_to_transcribe,
            )
        return transcript
    
if __name__ == '__main__':
    server = Server()
    server.app.run(debug=True)

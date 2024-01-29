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

        self.app.route('/api/transcribe', methods=['POST'])(self.transcribe_endpoint)
    
    def transcribe_endpoint(self):
        if 'file' not in request.files:
            return jsonify(error="No file provided"), 400

        file = request.files['file']

        try:
            transcript = self.transcribe_file(file)
            return jsonify(message=transcript)
        except OpenAIError as e:
            return jsonify(error=f"OpenAI API error: {e}"), 500
        except Exception as e:
            return jsonify(error=f"Unexpected error: {e}"), 500

    def transcribe_file(self, audio_file):
        temp_save_file(self.data_folder_path, audio_file.filename, audio_file)
        
        file = os.path.join(self.data_folder_path, 'audio.mp3')
        audio_to_transcribe = open(file, "rb")

        transcript = self.client.audio.transcriptions.create(
            model="whisper-1", 
            file=audio_to_transcribe,
        )

        return transcript.text

    
if __name__ == '__main__':
    server = Server()
    server.app.run(debug=True)

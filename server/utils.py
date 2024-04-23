import os
from flask import jsonify
import subprocess

def temp_save_file(location, filename, file):
    save_path = os.path.join(location, filename)
    file.save(save_path)

async def transcribe_audio(file):
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
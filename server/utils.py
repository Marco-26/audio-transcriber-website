import os
from flask import jsonify
import subprocess


def temp_save_file(location, filename, file):
    save_path = os.path.join(location, filename)
    file.save(save_path)

async def transcribe_audio(file_path):
    try:
        process = subprocess.Popen(['python', 'transcribe.py', file_path], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        stdout, stderr = process.communicate()
        
        if process.returncode == 0:
            return stdout.decode().strip()
        else:
            print("Error transcribing file:", stderr.decode().strip())
            return None
    except Exception as e:
        print("Exception during transcription:", str(e))
        return None

from asyncio import sleep
from io import BytesIO
import os
import shutil
import subprocess
from pydub import AudioSegment
import uuid

from pathlib import Path
from datetime import datetime,timedelta
from werkzeug.datastructures import FileStorage
from flask import jsonify
from .transcribe import transcribe
from .models import FileEntry
from .exceptions.api_error import APIBadRequestError
MAX_FILES_USER = 10

def save_file(path, filename, file):
  save_path = os.path.join(path, filename)
  file.save(save_path)

def transcribe_audio(file_path):
  transcript = transcribe(file_path, "transcription")
  
  if not transcript:
    raise APIBadRequestError("Transcription failed, no transcript generated.")
  
  return transcript

def get_file_size(audio_file_path):
  size = os.path.getsize(audio_file_path)
  return round((size / (1024 * 1024)),2)

def get_file_info(audio_file_path):
  return str(get_file_size(audio_file_path)) + " MB"

def delete_old_files(app,db):
  data_folder_path = '/home/marco/dev/audio-transcriber-website/server/data'
  with app.app_context():
    try:
      # Definir o limite de tempo para 7 dias atrás
      time_limit = datetime.utcnow() - timedelta(days=7)
      # Buscar ficheiros mais antigos que o limite
      old_files = FileEntry.query.filter(FileEntry.date < time_limit).all()

      for file in old_files:
        print("Ficheiros a serem apagados: " + file.filename)
        folder_path = os.path.join(data_folder_path, str(file.id))
        if os.path.exists(folder_path):
          # Remove o diretório e seu conteúdo recursivamente
          shutil.rmtree(folder_path)
          print(f"Diretório {folder_path} removido com sucesso.")
        else:
          print(f"Diretório {folder_path} não encontrado.")
        db.session.delete(file)
      db.session.commit()
      print(f'{len(old_files)} old files deleted successfully.')
    except Exception as e:
        db.session.rollback()
        print(f'Error occurred while deleting old files: {e}')  

def convert_to_wav_and_save(file, unique_filename):
  output_path = f"data/{unique_filename}"
  try:
    subprocess.run(
      [
        "ffmpeg",
        "-i", "pipe:0",           # Input from standard input
        "-f", "wav",              # Output format as WAV
        output_path               # Save directly to the specified path
      ],
      input=file.read(),            # Read file data directly from FileStorage
      stdout=subprocess.PIPE,      # Capture standard output (optional)
      stderr=subprocess.PIPE,      # Capture standard error (for debugging)
      check=True                   # Raise exception on errors
    )
  except subprocess.CalledProcessError as e:
    print(f"FFmpeg error: {e.stderr.decode()}")
    return None
  
  # Return the path to the saved file
  return output_path

def generate_unique_filename(file):
  filename = file.filename.split('.')[0]
  unique_filename = f"{uuid.uuid4().hex}_{filename}.wav"
  return unique_filename
 
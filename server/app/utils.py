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

from .transcribe import transcribe
from .models import FileEntry

def save_file(path, filename, file):
    save_path = os.path.join(path, filename)
    file.save(save_path)

def transcribe_audio(file_path):
    transcript = transcribe(file_path, "transcription")
    
    if not transcript:
        print("Error transcribing file...")
        raise ValueError("Transcription failed, no transcript generated.")
    
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

def transcribe_and_save(file_path, file_id, file,db, data_folder_path):
    try:
        transcript = transcribe_audio(file_path=file_path)

        transcript_file_path = Path(data_folder_path) / file_id / "transcript.txt"
        with open(transcript_file_path, 'w') as temp_file:
            temp_file.write(transcript)
            temp_file.flush()

        file.transcribed = True
        db.session.add(file)
        db.session.commit()
    except Exception as e:
        print(f"Error during transcription: {str(e)}")
        raise e

def convert_to_wav_and_save(file, unique_filename):
    audio = AudioSegment.from_file(file, format="mp3")
    output_path = f"data/{unique_filename}"
    audio.export(output_path, format="wav")
    return output_path

def generate_unique_filename(file):
    filename = file.filename.split('.')[0]
    unique_filename = f"{uuid.uuid4().hex}_{filename}.wav"
    return unique_filename
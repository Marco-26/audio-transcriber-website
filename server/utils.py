from transcribe import transcribe
from pydub import AudioSegment
import os
from datetime import datetime,timedelta
from models import FileEntry
import shutil

def temp_save_file(location, filename, file):
    save_path = os.path.join(location, filename)
    file.save(save_path)

async def transcribe_audio(file_path):
    transcript = transcribe(file_path, "transcription")
    
    if not transcript:
        print("Error transcribing file...")
        return None
    
    return transcript

def get_file_size(audio_file_path):
    audio_file_path.seek(0, os.SEEK_END)
    size = audio_file_path.tell()
    audio_file_path.seek(0)
    return round((size / (1024 * 1024)),2)

    
def get_file_info(audio_file_path):
    return str(get_file_size(audio_file_path)) + " MB"

def delete_old_files(app,db):
    data_folder_path = '/home/marco/dev/audio-transcriber-website/server/data'
    with app.app_context():
        try:
            # Definir o limite de tempo para 7 dias atrás
            time_limit = datetime.utcnow() - timedelta(days=7)
            print(time_limit)
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
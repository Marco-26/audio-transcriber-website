from transcribe import transcribe
from pydub import AudioSegment
import os
import datetime

def temp_save_file(location, filename, file):
    save_path = os.path.join(location, filename)
    file.save(save_path)

async def transcribe_audio(file_path):
    transcript = transcribe(file_path, "transcription")
    
    if not transcript:
        print("Error transcribing file...")
        return None
    
    return transcript

def get_audio_time(audio_file_path):
    audio = AudioSegment.from_file(audio_file_path)
    duration_in_seconds = len(audio) / 1000.0  # pydub works in milliseconds
    audio_time = datetime.timedelta(seconds=duration_in_seconds)
    hours, remainder = divmod(audio_time.seconds, 3600)
    minutes, seconds = divmod(remainder, 60)
    return f"{hours:02}:{minutes:02}:{seconds:02}"

def get_file_size(audio_file_path):
    audio_file_path.seek(0, os.SEEK_END)
    size = audio_file_path.tell()
    audio_file_path.seek(0)
    return round((size / (1024 * 1024)),2)
    
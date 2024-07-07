import os
from transcribe import transcribe

def temp_save_file(location, filename, file):
    save_path = os.path.join(location, filename)
    file.save(save_path)

async def transcribe_audio(file_path):
    transcript = transcribe(file_path, "transcription")
    
    if not transcript:
        print("Error transcribing file...")
        return None
    
    return transcript
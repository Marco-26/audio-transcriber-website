from src import db, User, FileEntry
import os

def test_fetch_transcribed_audio_success(client):
  user = User(name="Test User", email="testuser@example.com", google_id="test_user_id", profile_image_url="http://example.com/pic.jpg")
  db.session.add(user)
  db.session.commit()

  file = FileEntry(user_id="test_user_id", filename="test_audio.mp3", file_info="file1_info")
  db.session.add(file)
  db.session.commit()

  upload_folder = '/home/marco/dev/audio-transcriber-website/server/src/data'
  file_path = os.path.join(upload_folder, str(file.id))
  os.makedirs(file_path, exist_ok=True)
  transcript_file_path = os.path.join(file_path, 'transcript.txt')

  with open(transcript_file_path, 'w') as f:
    f.write("This is a mock transcription.")

  response = client.get(f'/api/transcription/{file.id}')

  assert response.status_code == 200
  json_data = response.get_json()
  assert json_data['message'] == "Finished fetching transcription..."
  assert json_data['transcription'] == "This is a mock transcription."

  if os.path.exists(transcript_file_path):
      os.remove(transcript_file_path) 

  if os.path.exists(file_path) and not os.listdir(file_path):
      os.rmdir(file_path) 

def test_fetch_transcribed_audio_not_found(client):
  user = User(name="Test User", email="testuser@example.com", google_id="test_user_id", profile_image_url="http://example.com/pic.jpg")
  db.session.add(user)
  db.session.commit()

  file = FileEntry(user_id="test_user_id", filename="test_audio.mp3", file_info="file1_info")
  db.session.add(file)
  db.session.commit()

  response = client.get(f'/api/transcription/{file.id}')

  assert response.status_code == 404
  json_data = response.get_json()
  assert json_data['error'] == "Transcription not found."

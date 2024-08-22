import os
from unittest.mock import patch, AsyncMock
import pytest
from server.src import db, FileEntry, User


# Assuming you have some helper functions/fixtures to set up users and files

@pytest.fixture
def setup_user_and_file(client):
    user = User(name="Test User", email="testuser@example.com", google_id="test_user_id", profile_image_url="http://example.com/pic.jpg")
    db.session.add(user)
    db.session.commit()

    file = FileEntry(user_id=user.google_id, filename="test_audio.mp3", file_info="file_info")
    db.session.add(file)
    db.session.commit()

    upload_folder = '/home/marco/dev/audio-transcriber-website/server/src/data'
    file_path = os.path.join(upload_folder, str(file.id))
    os.makedirs(file_path, exist_ok=True)
    audio_file_path = os.path.join(file_path, 'test_audio.mp3')
    with open(audio_file_path, 'wb') as f:
        f.write(b"This is a mock transcript.")

    return user, file, file_path, audio_file_path

@patch('server.src.utils.transcribe_audio', new_callable=AsyncMock)
def test_transcription_file_not_found(mock_transcribe_audio, client):
    # Assuming no file is created

    # Send the POST request to the endpoint with a non-existent file
    response = client.post('/api/transcript/test_user_id/1/test_audio.mp3')

    # Assertions
    assert response.status_code == 404
    json_data = response.get_json()
    assert json_data['error'] == 'File not found'
    mock_transcribe_audio.assert_not_called()

@patch('server.src.utils.transcribe_audio', new_callable=AsyncMock)
def test_transcription_audio_file_not_found(mock_transcribe_audio, client, setup_user_and_file):
    user, file, file_path, audio_file_path = setup_user_and_file

    # Remove the audio file to simulate it being missing
    os.remove(audio_file_path)

    # Send the POST request to the endpoint
    response = client.post(f'/api/transcript/{user.google_id}/{file.id}/test_audio.mp3')

    # Assertions
    assert response.status_code == 404
    json_data = response.get_json()
    assert json_data['error'] == 'Audio file not found'
    mock_transcribe_audio.assert_not_called()

@patch('server.src.utils.transcribe_audio', new_callable=AsyncMock)
def test_transcription_failure(mock_transcribe_audio, client, setup_user_and_file):
    user, file, file_path, audio_file_path = setup_user_and_file

    # Mock the transcribe_audio function to raise an exception
    mock_transcribe_audio.side_effect = Exception("Transcription failed")

    # Send the POST request to the endpoint
    response = client.post(f'/api/transcript/{user.google_id}/{file.id}/test_audio.mp3')

    # Assertions
    assert response.status_code == 500
    json_data = response.get_json()
    assert json_data['error'] == 'An unexpected error occurred. Failed to transcribe audio'

    # Ensure no transcript file is created
    transcript_file_path = os.path.join(file_path, 'transcript.txt')
    assert not os.path.exists(transcript_file_path)

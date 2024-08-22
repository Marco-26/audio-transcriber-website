from src import db, User, FileEntry
import io

def test_upload_file_success(client):
  user = User(name="Test User", email="testuser@example.com", google_id="test_user_id", profile_image_url="http://example.com/pic.jpg")
  db.session.add(user)
  db.session.commit()

  data = {
      'user_id': 'test_user_id',
      'file': (io.BytesIO(b"Test file content"), 'test.txt'),
  }

  response = client.post('/api/upload', data=data, content_type='multipart/form-data')

  assert response.status_code == 200
  json_data = response.get_json()
  assert json_data['message'] == 'File uploaded sucessfuly'
  assert 'fileEntry' in json_data
  assert json_data['fileEntry']['filename'] == 'test.txt'

def test_upload_no_file(client):
  user = User(name="Test User", email="testuser@example.com", google_id="test_user_id", profile_image_url="http://example.com/pic.jpg")
  db.session.add(user)
  db.session.commit()

  data = {
      'user_id': 'test_user_id',
  }

  response = client.post('/api/upload', data=data, content_type='multipart/form-data')

  assert response.status_code == 400
  json_data = response.get_json()
  assert json_data['error'] == 'No file provided'

def test_upload_no_user_id(client):
  data = {
      'file': (io.BytesIO(b"Test file content"), 'test.txt'),
  }

  response = client.post('/api/upload', data=data, content_type='multipart/form-data')

  assert response.status_code == 400
  json_data = response.get_json()
  assert json_data['error'] == 'No user_id provided'

def test_upload_user_not_found(client):
  data = {
      'user_id': 'nonexistent_user',
      'file': (io.BytesIO(b"Test file content"), 'test.txt'),
  }

  response = client.post('/api/upload', data=data, content_type='multipart/form-data')

  assert response.status_code == 404
  json_data = response.get_json()
  assert json_data['error'] == 'User not found'
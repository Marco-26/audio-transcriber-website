import os
import shutil
import pytest
from src import db, User, FileEntry

def test_delete_directory_success(client):
  # 1. Create a user and file entry in the database
  user = User(name="Test User", email="testuser@example.com", google_id="test_user_id", profile_image_url="http://example.com/pic.jpg")
  db.session.add(user)
  db.session.commit()

  file_entry = FileEntry(user_id="test_user_id", filename="test_directory", file_info="directory_info")
  db.session.add(file_entry)
  db.session.commit()

  # 2. Create a mock directory in the file system
  upload_folder = '/home/marco/dev/audio-transcriber-website/server/src/data'
  directory_path = os.path.join(upload_folder, str(file_entry.id))
  os.makedirs(directory_path, exist_ok=True)
  
  # 3. Send DELETE request
  response = client.delete(f'/api/delete/{file_entry.id}')
  
  # 4. Assertions
  assert response.status_code == 200
  json_data = response.get_json()
  assert json_data['message'] == f"Successfully deleted the file or directory with id: {file_entry.id}"
  
  # 5. Verify that the directory and DB entry were deleted
  assert not os.path.exists(directory_path)
  assert FileEntry.query.get(file_entry.id) is None

def test_delete_file_success(client):
  # 1. Create a user and file entry in the database
  user = User(name="Test User", email="testuser@example.com", google_id="test_user_id", profile_image_url="http://example.com/pic.jpg")
  db.session.add(user)
  db.session.commit()

  file_entry = FileEntry(user_id="test_user_id", filename="test_file.txt", file_info="file_info")
  db.session.add(file_entry)
  db.session.commit()

  # 2. Create a mock file in the file system
  upload_folder = '/home/marco/dev/audio-transcriber-website/server/src/data'
  file_path = os.path.join(upload_folder, str(file_entry.id))
  with open(file_path, 'w') as f:
      f.write("Mock content")

  # 3. Send DELETE request
  response = client.delete(f'/api/delete/{file_entry.id}')
  
  # 4. Assertions
  assert response.status_code == 200
  json_data = response.get_json()
  assert json_data['message'] == f"Successfully deleted the file or directory with id: {file_entry.id}"
  
  # 5. Verify that the file and DB entry were deleted
  assert not os.path.exists(file_path)
  assert FileEntry.query.get(file_entry.id) is None

def test_delete_non_existent_file_or_directory(client):
  # Attempt to delete a non-existent file/directory
  response = client.delete('/api/delete/999')

  # Assertions
  assert response.status_code == 500
  json_data = response.get_json()
  assert json_data['error'] == "There was an error deleting the file or directory."

def test_delete_error_handling(client):
  # 1. Create a user and file entry in the database
  user = User(name="Test User", email="testuser@example.com", google_id="test_user_id", profile_image_url="http://example.com/pic.jpg")
  db.session.add(user)
  db.session.commit()

  file_entry = FileEntry(user_id="test_user_id", filename="test_file_error.txt", file_info="file_info")
  db.session.add(file_entry)
  db.session.commit()

  # 2. Create a mock file in the file system
  upload_folder = '/home/marco/dev/audio-transcriber-website/server/src/data'
  file_path = os.path.join(upload_folder, str(file_entry.id))
  with open(file_path, 'w') as f:
      f.write("Mock content")

  # 3. Patch os.remove to simulate an error during deletion
  with patch("os.remove", side_effect=Exception("Mock deletion error")):
      response = client.delete(f'/api/delete/{file_entry.id}')
      
      # Assertions
      assert response.status_code == 500
      json_data = response.get_json()
      assert json_data['error'] == "There was an error deleting the file or directory."

      # 4. Verify that the file and DB entry still exist
      assert os.path.exists(file_path)
      assert FileEntry.query.get(file_entry.id) is not None

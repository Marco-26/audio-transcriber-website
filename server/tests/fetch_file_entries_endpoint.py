from src import db, User, FileEntry

def test_get_file_entries_user_not_logged_in(client):
    with client.session_transaction() as sess:
        sess.clear()

    response = client.get('/api/entries/test_user_id/all')

    assert response.status_code == 401
    assert response.json['error'] == "Unauthorized access."

def test_get_file_entries_user_not_found(client):
    response = client.get('/api/entries/test_user_id/all')

    assert response.status_code == 404
    assert response.json['error'] == "User not found"

def test_get_file_entries_not_found(client):
    with client.application.app_context():
        user = User(name="Test User", email="testuser@example.com", google_id="test_user_id", profile_image_url="http://example.com/pic.jpg")
        db.session.add(user)
        db.session.commit()

    response = client.get('/api/entries/test_user_id/all')
    assert response.status_code == 404
    assert response.json['error'] == 'No files found for this user'


def test_get_file_entries_fetch_all(client):
    with client.application.app_context():
        user = User(name="Test User", email="testuser@example.com", google_id="test_user_id", profile_image_url="http://example.com/pic.jpg")
        db.session.add(user)
        db.session.commit()

        file1 = FileEntry(user_id="test_user_id", filename="file1.txt", file_info="file1_info")
        file2 = FileEntry(user_id="test_user_id", filename="file2.txt", file_info="file2_info")
        db.session.add_all([file1, file2])
        db.session.commit()

    # Fetch all files
    response = client.get('/api/entries/test_user_id/all')
    assert response.status_code == 200
    assert len(response.json['files']) == 2
    assert response.json['files'][0]['filename'] == "file1.txt"
    assert response.json['files'][1]['filename'] == "file2.txt"

def test_get_file_entries_fetch_transcribed(client):
    # Create a test user and file entries in the database
    with client.application.app_context():
        user = User(name="Test User", email="testuser@example.com", google_id="test_user_id", profile_image_url="http://example.com/pic.jpg")
        db.session.add(user)
        db.session.commit()

        file1 = FileEntry(user_id="test_user_id", filename="file1.txt", file_info="file1_info")
        file2 = FileEntry(user_id="test_user_id", filename="file2.txt", file_info="file2_info")

        #Simulating a transcribed file
        file2.transcribed = True

        db.session.add_all([file1, file2])
        db.session.commit()

    # Fetch only transcribed files
    response = client.get('/api/entries/test_user_id/done')
    assert response.status_code == 200
    assert len(response.json['files']) == 1
    assert response.json['files'][0]['filename'] == "file2.txt"

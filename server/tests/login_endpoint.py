import pytest
from unittest.mock import patch, MagicMock
from app import db, User

# Sample allowed users list
allowed_users = ["alloweduser@example.com"]

@pytest.fixture
def mock_google_responses():
    # Mock the response from Google's token and userinfo endpoints
    mock_token_response = MagicMock()
    mock_token_response.json.return_value = {
        "access_token": "mock_access_token"
    }
    
    mock_userinfo_response = MagicMock()
    mock_userinfo_response.json.return_value = {
        "email": "alloweduser@example.com",
        "name": "Allowed User",
        "sub": "mock_google_id",
        "picture": "http://example.com/pic.jpg"
    }

    return mock_token_response, mock_userinfo_response

@patch('requests.post')
@patch('requests.get')
def test_login_success_new_user(mock_get, mock_post, client, mock_google_responses):
    # Mock the Google OAuth responses
    mock_post.return_value = mock_google_responses[0]
    mock_get.return_value = mock_google_responses[1]

    # Send the login request with a mock authorization code
    response = client.post('/google_login', json={"code": "mock_auth_code"})

    # Assertions
    assert response.status_code == 200
    json_data = response.get_json()
    assert json_data['user']['email'] == "alloweduser@example.com"
    assert json_data['user']['name'] == "Allowed User"

    # Verify that the user was added to the database
    user = User.query.filter_by(email="alloweduser@example.com").first()
    assert user is not None
    assert user.google_id == "mock_google_id"

    # Verify that the user_id is stored in the session
    with client.session_transaction() as sess:
        assert sess["user_id"] == "mock_google_id"

@patch('requests.post')
@patch('requests.get')
def test_login_success_existing_user(mock_get, mock_post, client, mock_google_responses):
    # Add a user to the database
    user = User(name="Existing User", email="alloweduser@example.com", google_id="mock_google_id", profile_image_url="http://example.com/pic.jpg")
    db.session.add(user)
    db.session.commit()

    # Mock the Google OAuth responses
    mock_post.return_value = mock_google_responses[0]
    mock_get.return_value = mock_google_responses[1]

    # Send the login request with a mock authorization code
    response = client.post('/google_login', json={"code": "mock_auth_code"})

    # Assertions
    assert response.status_code == 200
    json_data = response.get_json()
    assert json_data['user']['email'] == "alloweduser@example.com"
    assert json_data['user']['name'] == "Existing User"

    # Verify that the user was not duplicated in the database
    user_count = User.query.filter_by(email="alloweduser@example.com").count()
    assert user_count == 1

    # Verify that the user_id is stored in the session
    with client.session_transaction() as sess:
        assert sess["user_id"] == "mock_google_id"

@patch('requests.post')
@patch('requests.get')
def test_login_unauthorized_user(mock_get, mock_post, client, mock_google_responses):
    # Modify the mock response to return an unauthorized user
    mock_userinfo_response = mock_google_responses[1]
    mock_userinfo_response.json.return_value["email"] = "unauthorized@example.com"
    mock_get.return_value = mock_userinfo_response

    with client.session_transaction() as sess:
      sess.clear()  # Clear session before test

    # Send the login request with a mock authorization code
    response = client.post('/google_login', json={"code": "mock_auth_code"})

    # Assertions
    assert response.status_code == 401
    json_data = response.get_json()
    assert json_data['error'] == "OAuth token exchange failed"

    # Verify that the unauthorized user was not added to the database
    user = User.query.filter_by(email="unauthorized@example.com").first()
    assert user is None

    # Verify that the session was not created
    with client.session_transaction() as sess:
        assert "user_id" not in sess

@patch('requests.post')
@patch('requests.get')
def test_login_google_oauth_failure(mock_get, mock_post, client):
    # Simulate an error response from the Google token endpoint
    mock_post.return_value = MagicMock(status_code=400, json=MagicMock(return_value={"error": "invalid_grant"}))
    
    with client.session_transaction() as sess:
      sess.clear()  # Clear session before test
    
    # Send the login request with a mock authorization code
    response = client.post('/google_login', json={"code": "invalid_auth_code"})

    # Assertions
    assert response.status_code == 401
    json_data = response.get_json()
    assert json_data['error'] == "OAuth token exchange failed"

    # Verify that no user was added to the database
    user_count = User.query.count()
    assert user_count == 0

    # Verify that the session was not created
    with client.session_transaction() as sess:
        assert "user_id" not in sess

import requests
from flask import Blueprint, jsonify, request, session
from ..app import allowed_users, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
from ..models.user import User
from ..db import db

auth_bp = Blueprint('auth_bp', __name__)

@auth_bp.route('/auth/login', methods=['POST'])
def login():
    auth_code = request.get_json()['code']

    data = {
        'code': auth_code,
        'client_id': GOOGLE_CLIENT_ID,  # client ID from the credential at google developer console
        'client_secret': GOOGLE_CLIENT_SECRET,  # client secret from the credential at google developer console
        'redirect_uri': 'postmessage',
        'grant_type': 'authorization_code'
    }

    response = requests.post('https://oauth2.googleapis.com/token', data=data).json()
    
    if 'access_token' not in response:
        return jsonify(error="OAuth token exchange failed"), 401

    headers = {
        'Authorization': f'Bearer {response["access_token"]}'
    }
    user_info = requests.get('https://www.googleapis.com/oauth2/v3/userinfo', headers=headers).json()

    if user_info["email"] not in allowed_users:
        return jsonify(error="Unauthorized"), 401

    user = User.query.filter_by(email = user_info["email"]).first()
    
    if not user:
        user = User(user_info["name"], user_info["email"], user_info["sub"], user_info["picture"])
        db.session.add(user)
        db.session.commit()

    session["user_id"] = user.google_id
    
    return jsonify(user=user.to_dict()), 200

@auth_bp.route("/auth/logout", methods=["POST"])
def logout_user():
    session.pop("user_id")
    return "200"
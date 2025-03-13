import requests
from flask import Blueprint, jsonify, request, session
from ..app import allowed_users, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
from ..models.user import User
from ..services import auth_service, user_service
from ..exceptions.api_error import APIBadRequestError, APIAuthError

auth_bp = Blueprint('auth_bp', __name__)

@auth_bp.route('/auth/login', methods=['POST'])
def login():
  auth_code = request.get_json().get('code')

  if not auth_code:
    raise APIBadRequestError("Missing authentication code.")

  token = auth_service.auth_code_for_token(auth_code)
  if not token:
    raise APIAuthError("Authentication failed. Invalid authorization code.")

  user_info = auth_service.get_user_info_by_token(token)
  if user_info["email"] not in allowed_users:
    raise APIAuthError("Access denied. This application is currently in a restricted testing phase.")

  user = user_service.get_user_by_email(user_info["email"])
  if not user:
    user = user_service.create_user(user_info=user_info)

  session["user_id"] = user.id
  return jsonify(success=True, message="User logged in successfully.", payload=user.to_dict())

@auth_bp.route("/auth/logout", methods=["POST"])
def logout_user():
  if "user_id" not in session:
    raise APIAuthError("Unauthorized logout attempt. No active session found.")

  session.pop("user_id")
  return jsonify(success=True, message="User logged out successfully."), 200

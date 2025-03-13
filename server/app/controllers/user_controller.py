from flask import Blueprint, jsonify,  session
from ..models import User
from ..services import user_service
from ..exceptions.api_error import APINotFoundError
from .transcription_controller import login_required
user_bp = Blueprint('user_bp', __name__)

@user_bp.route("/users/me",methods=['GET'])
@login_required
def get_current_user():
  user_id = session["user_id"]

  user = user_service.get_user_by_id(user_id)
  if not user:
    raise APINotFoundError("User not found")
  
  return jsonify(success=True, message="Current user retrieved successfully", payload=user.to_dict()), 200

@user_bp.route("/users/count",methods=['GET'])
def fetch_registered_users():
  registered_users = user_service.get_user_count()
  return jsonify(success=True, message="Registered users retrieved successfully", payload=registered_users), 200
    

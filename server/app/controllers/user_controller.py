from flask import Blueprint, jsonify,  session
from ..models import User
from ..services import user_service
user_bp = Blueprint('user_bp', __name__)

@user_bp.route("/users/me",methods=['GET'])
def get_current_user():
    user_id = session.get("user_id")
    
    if not user_id:
        return jsonify(success=False, error="User not found"), 404

    user = user_service.get_user_by_id(user_id)

    if not user:
        return jsonify(success=False, error="No user was found with the given id"), 404
    
    return jsonify(success=True, message="Current user retrieved successfully", data=user.to_dict()), 200

@user_bp.route("/users/count",methods=['GET'])
def fetch_registered_users():
    registered_users = user_service.get_user_count()
    return jsonify(success=True, message="Registered users retrieved successfully", data=registered_users), 200
    

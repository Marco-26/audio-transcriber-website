from flask import Blueprint, jsonify,  session
from ..models import User

user_bp = Blueprint('user_bp', __name__)

@user_bp.route("/users/me",methods=['GET'])
def get_current_user():
    user_id = session.get("user_id")
    
    if not user_id:
        return jsonify(error="User not found"), 404

    user = User.query.filter_by(google_id=user_id).first()
    return jsonify(user=user.to_dict()), 200

@user_bp.route("/users/count",methods=['GET'])
def fetch_registered_users():
    registered_users = User.query.count()
    return jsonify(registered_users=registered_users), 200
    

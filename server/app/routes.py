from pathlib import Path
import shutil
import asyncio
import os
import shutil
from functools import wraps
from pathlib import Path
import requests
from flask import jsonify, request, session
from werkzeug.utils import secure_filename

from .app import data_folder_path, allowed_users, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
from .models.models import User, FileEntry
from .utils import MAX_FILES_USER, save_file, transcribe_audio, get_file_info, convert_to_wav_and_save, generate_unique_filename


# def login_required(f):
#     @wraps(f)
#     def decorated_function(*args, **kwargs):
#         if 'user_id' not in session:
#             return jsonify(error="Unauthorized access."), 401
#         return f(*args, **kwargs)
#     return decorated_function

# def register_routes(app, db):






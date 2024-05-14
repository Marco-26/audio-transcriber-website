import json
from flask import  jsonify, request,redirect
from models import User
import os
from utils import temp_save_file
from app import data_folder_path, auth_client, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
from flask_login import login_user,logout_user, current_user,login_required
import requests
from flask.wrappers import Response

def register_routes(app, db, bcrypt):
    @app.route("/login")
    def login():
        # Find out what URL to hit for Google login
        google_provider_cfg = get_google_provider_cfg()
        authorization_endpoint = google_provider_cfg["authorization_endpoint"]

        # Use library to construct the request for Google login and provide
        # scopes that let you retrieve user's profile from Google
        request_uri = auth_client.prepare_request_uri(
            authorization_endpoint,
            redirect_uri=request.base_url + "/callback",
            scope=["openid", "email", "profile"],
        )

        return Response(
            response=json.dumps({'auth_url':request_uri}),
            status=202,
            mimetype='application/json'
        )

    
    @app.route("/login/callback")
    def callback():
    # Get authorization code Google sent back to you
        code = request.args.get("code")
        # Find out what URL to hit to get tokens that allow you to ask for
        # things on behalf of a user
        google_provider_cfg = get_google_provider_cfg()
        token_endpoint = google_provider_cfg["token_endpoint"]
        # Prepare and send a request to get tokens! Yay tokens!
        token_url, headers, body = auth_client.prepare_token_request(
            token_endpoint,
            authorization_response=request.url,
            redirect_url=request.base_url,
            code=code
        )
        token_response = requests.post(
            token_url,
            headers=headers,
            data=body,
            auth=(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET),
        )

        # Parse the tokens!
        auth_client.parse_request_body_response(json.dumps(token_response.json()))
        # Now that you have tokens (yay) let's find and hit the URL
        # from Google that gives you the user's profile information,
        # including their Google profile image and email
        userinfo_endpoint = google_provider_cfg["userinfo_endpoint"]
        uri, headers, body = auth_client.add_token(userinfo_endpoint)
        userinfo_response = requests.get(uri, headers=headers, data=body)
        # You want to make sure their email is verified.
        # The user authenticated with Google, authorized your
        # app, and now you've verified their email through Google!
        if userinfo_response.json().get("email_verified"):
            unique_id = userinfo_response.json()["sub"]
            user_email = userinfo_response.json()["email"]
            picture = userinfo_response.json()["picture"]
            user_name = userinfo_response.json()["given_name"]
        else:
            return "User email not available or not verified by Google.", 400
        
        # Create a user in your db with the information provided
        # by Google
        user = User(
            name=user_name, email=user_email
        )

        # Doesn't exist? Add it to the database.
        if not User.query.filter_by(email=user_email).first():
            db.session.add(user)
            db.session.commit()

        # Begin user session by logging the user in
        login_user(user, remember = True)

        # Send user back to homepage
        return jsonify(message = "Worked")

    @app.route("/logout", methods=['POST'])
    @login_required
    def logout():
        logout_user()
        return jsonify(message="Logged out")
    
    @app.route("/api/upload", methods=['POST'])
    def upload_endpoint():
        if 'file' not in request.files:
            return jsonify(error="No file provided"), 400

        file = request.files['file']
        temp_save_file(data_folder_path, file.filename, file)

        return jsonify(message="File uploaded sucessfuly")
    
    @app.route("/api/transcript", methods=['POST'])
    async def transcript_endpoint():
        data = request.get_json()
        filename = data.get('filename')
        file = os.path.join(data_folder_path, filename)

        #transcript = await transcribe_audio(file)

        os.remove(file)
        return transcript
    
    @app.route("/api/delete/<filename>", methods=['DELETE'])
    def delete_endpoint(filename):
        print("Nome do ficheiro: " + filename)
        try:
            os.remove(data_folder_path+"/"+filename)
        except Exception as e:
            return jsonify(error="There was an error deleting the file...")

        return jsonify(message="Sucessfully deleted the file")
    

def get_google_provider_cfg():
    GOOGLE_DISCOVERY_URL = (
        "https://accounts.google.com/.well-known/openid-configuration"
    )
    return requests.get(GOOGLE_DISCOVERY_URL).json()
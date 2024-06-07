import json
from flask import  abort, jsonify, request,redirect, url_for
from models import User
import os
from utils import temp_save_file
from app import data_folder_path, auth_client, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, secret_key,client_secrets_file
from flask_login import login_user,logout_user, current_user,login_required
from flask.globals import session
import requests
import jwt
from flask.wrappers import Response
from datetime import datetime, timedelta
from google_auth_oauthlib.flow import Flow
from google.oauth2 import id_token
import google

BACKEND_URL = "https://127.0.0.1:5000"
FRONTEND_URL = "http://localhost:3000" 

def login_required(function):
    def wrapper(*args, **kwargs):
        encoded_jwt=request.headers.get("Authorization").split("Bearer ")[1]
        if encoded_jwt==None:
            return abort(401)
        else:
            return function()
    return wrapper

flow = Flow.from_client_secrets_file(
    client_secrets_file = client_secrets_file,
    scopes=[
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
        "openid",
    ],
    redirect_uri=BACKEND_URL+"/callback",
)

def register_routes(app, db, bcrypt):
    # @app.route("/login")
    # def login():
    #     # Find out what URL to hit for Google login
    #     google_provider_cfg = get_google_provider_cfg()
    #     authorization_endpoint = google_provider_cfg["authorization_endpoint"]

    #     # Use library to construct the request for Google login and provide
    #     # scopes that let you retrieve user's profile from Google
    #     request_uri = auth_client.prepare_request_uri(
    #         authorization_endpoint,
    #         redirect_uri=request.base_url + "/callback",
    #         scope=["openid", "email", "profile"],
    #     )

    #     return Response(
    #         response=json.dumps({'auth_url':request_uri}),
    #         status=202,
    #         mimetype='application/json'
    #     )

    
    # @app.route("/login/callback")
    # def callback():
    # # Get authorization code Google sent back to you
    #     code = request.args.get("code")
    #     # Find out what URL to hit to get tokens that allow you to ask for
    #     # things on behalf of a user
    #     google_provider_cfg = get_google_provider_cfg()
    #     token_endpoint = google_provider_cfg["token_endpoint"]
    #     # Prepare and send a request to get tokens! Yay tokens!
    #     token_url, headers, body = auth_client.prepare_token_request(
    #         token_endpoint,
    #         authorization_response=request.url,
    #         redirect_url=request.base_url,
    #         code=code
    #     )
    #     token_response = requests.post(
    #         token_url,
    #         headers=headers,
    #         data=body,
    #         auth=(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET),
    #     )

    #     # Parse the tokens!
    #     auth_client.parse_request_body_response(json.dumps(token_response.json()))
    #     # Now that you have tokens (yay) let's find and hit the URL
    #     # from Google that gives you the user's profile information,
    #     # including their Google profile image and email
    #     userinfo_endpoint = google_provider_cfg["userinfo_endpoint"]
    #     uri, headers, body = auth_client.add_token(userinfo_endpoint)
    #     userinfo_response = requests.get(uri, headers=headers, data=body)
    #     # You want to make sure their email is verified.
    #     # The user authenticated with Google, authorized your
    #     # app, and now you've verified their email through Google!
    #     if userinfo_response.json().get("email_verified"):
    #         user_email = userinfo_response.json()["email"]
    #         user_name = userinfo_response.json()["given_name"]
    #     else:
    #         return "User email not available or not verified by Google.", 400
        
    #     # Create a user in your db with the information provided
    #     # by Google
    #     user = User(
    #         name=user_name, email=user_email
    #     )

    #     # Doesn't exist? Add it to the database.
    #     if not User.query.filter_by(email=user_email).first():
    #         db.session.add(user)
    #         db.session.commit()

    #     # Begin user session by logging the user in
    #     login_user(user, remember = True)

    #     payload = {
    #         'user_id': user.id,
    #         'email': user.email,
    #         'name': user.name,
    #         'exp': datetime.utcnow() + timedelta(hours=24)  # Token expiration time
    #     }

    #     token = Generate_JWT(payload)

    #     # Send user back to homepage
    #     return redirect(f'http://localhost:3000/?jwt={token}')
    @app.route("/callback")
    def callback():
        flow.fetch_token(authorization_response=request.url)
        credentials = flow.credentials
        request_session = requests.session()
        token_request = google.auth.transport.requests.Request(session=request_session)

        id_info = id_token.verify_oauth2_token(
            id_token=credentials._id_token, request=token_request,
            audience=GOOGLE_CLIENT_ID
        )
        session["google_id"] = id_info.get("sub")
        
        # removing the specific audience, as it is throwing error
        del id_info['aud']
        jwt_token=Generate_JWT(id_info)
        # insert_into_db(
        #     id_info.get('name'),
        #     id_info.get('email'),
        #     id_info.get('picture')
        # )
        return redirect(f"{FRONTEND_URL}?jwt={jwt_token}")


    @app.route("/login")
    def login():
        authorization_url, state = flow.authorization_url()
        # Store the state so the callback can verify the auth server response.
        session["state"] = state
        return Response(
            response=json.dumps({'auth_url':authorization_url}),
            status=200,
            mimetype='application/json'
        )

    @app.route("/logout")
    def logout():
        #clear the local storage from frontend
        session.clear()
        return Response(
            response=json.dumps({"message":"Logged out"}),
            status=202,
            mimetype='application/json'
        )

    @app.route("/home")
    @login_required
    def home_page_user():
        encoded_jwt=request.headers.get("Authorization").split("Bearer ")[1]
        try:
            decoded_jwt = jwt.decode(encoded_jwt, app.secret_key, algorithm="HS256")
            print(decoded_jwt)
        except Exception as e: 
            return Response(
                response=json.dumps({"message":"Decoding JWT Failed", "exception":e.args}),
                status=500,
                mimetype='application/json'
            )
        return Response(
            response=json.dumps(decoded_jwt),
            status=200,
            mimetype='application/json'
        )
    
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

def Generate_JWT(payload):
    encoded_jwt = jwt.encode(payload, secret_key, algorithm='HS256')
    return encoded_jwt
import requests
from ..app import GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET

def auth_code_for_token(auth_code):
  data = {
    'code': auth_code,
    'client_id': GOOGLE_CLIENT_ID,  # client ID from the credential at google developer console
    'client_secret': GOOGLE_CLIENT_SECRET,  # client secret from the credential at google developer console
    'redirect_uri': 'postmessage',
    'grant_type': 'authorization_code'
  }
  
  response = requests.post('https://oauth2.googleapis.com/token', data=data).json()
  return response if 'access_token' in response else None

def get_user_info_by_token(token):
  headers = {
    'Authorization': f'Bearer {token["access_token"]}'
  }
  return requests.get('https://www.googleapis.com/oauth2/v3/userinfo', headers=headers).json()
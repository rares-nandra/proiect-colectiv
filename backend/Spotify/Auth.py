from flask import Flask, redirect, request, url_for, Blueprint
import spotipy
from spotipy.oauth2 import SpotifyOAuth
import os

spotify_auth_bp = Blueprint('spotify-auth', __name__)
sp_oauth = None

def set_spotify_auth_obj():
    global sp_oauth
    SPOTIPY_CLIENT_ID = os.getenv("SPOTIPY_CLIENT_ID")
    SPOTIPY_CLIENT_SECRET = os.getenv("SPOTIPY_CLIENT_SECRET")
    SPOTIPY_REDIRECT_URI = os.getenv("SPOTIPY_REDIRECT_URI")

    sp_oauth = SpotifyOAuth(
        client_id=SPOTIPY_CLIENT_ID,
        client_secret=SPOTIPY_CLIENT_SECRET,
        redirect_uri=SPOTIPY_REDIRECT_URI,
        scope="user-top-read playlist-read-private playlist-read-collaborative"
    )

@spotify_auth_bp.route('/auth', methods=['GET'])
def login():
    auth_url = sp_oauth.get_authorize_url()
    return redirect(auth_url)


@spotify_auth_bp.route('/token', methods=['GET'])
def callback():
    code = request.args.get('code')
    if not code:
        return jsonify({'error': 'No code provided by Spotify'}), 400
    
    try:
        token_info = sp_oauth.get_access_token(code)
        access_token = token_info['access_token']

        print(access_token)
        
        # TODO write access token to DB 

        return jsonify({'message': 'Spotify authentication successful!', 'access_token': access_token})
    except Exception as e:
        return jsonify({'error': f'Failed to authenticate with Spotify: {str(e)}'}), 500
from flask import Flask, redirect, request, url_for, Blueprint, jsonify
import spotipy
from spotipy.oauth2 import SpotifyOAuth
import os
from utils.Mongodb import MongoDB  # Import the MongoDB class

spotify_auth_bp = Blueprint('spotify-auth', __name__)
sp_oauth = None

# Initialize MongoDB connection
mongo_users = MongoDB(db_name="SPS", collection_name="users")  # Users collection

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

@spotify_auth_bp.route('/token', methods=['POST'])
def callback():
    data = request.json  # Get JSON data from the request
    code = data.get('code')
    user_email = data.get('email')  # Extract email from JSON body

    if not code:
        return jsonify({'error': 'No code provided by Spotify'}), 400

    if not user_email:
        return jsonify({'error': 'User email required in JSON body'}), 400

    try:
        token_info = sp_oauth.get_access_token(code)
        access_token = token_info['access_token']

        # Update user's document with Spotify token information
        user_doc = mongo_users.find_by_field("email", user_email)
        if not user_doc:
            return jsonify({'error': 'User not found in database'}), 404

        mongo_users.update_one(
            query={"email": user_email},
            update={"$set": {
                "spotify_access_token": access_token,
            }}
        )

        return jsonify({'message': 'Spotify authentication successful!', 'access_token': access_token}), 200
    except Exception as e:
        return jsonify({'error': f'Failed to authenticate with Spotify: {str(e)}'}), 500
from flask import Flask, redirect, request, url_for, Blueprint, jsonify, session
import spotipy
from spotipy.oauth2 import SpotifyOAuth
import os
from utils.Mongodb import MongoDB  # Import the MongoDB class

spotify_auth_bp = Blueprint('spotify-auth', __name__)
sp_oauth = None

mongo_users = MongoDB(db_name="SPS", collection_name="users")

def set_spotify_auth_obj():
    global sp_oauth
    SPOTIPY_CLIENT_ID = os.getenv("SPOTIPY_CLIENT_ID")
    SPOTIPY_CLIENT_SECRET = os.getenv("SPOTIPY_CLIENT_SECRET")
    SPOTIPY_REDIRECT_URI = os.getenv("SPOTIPY_REDIRECT_URI")

    sp_oauth = SpotifyOAuth(
        client_id=SPOTIPY_CLIENT_ID,
        client_secret=SPOTIPY_CLIENT_SECRET,
        redirect_uri=SPOTIPY_REDIRECT_URI,
        scope="user-top-read playlist-read-private playlist-read-collaborative user-read-email"
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

        sp = spotipy.Spotify(auth=access_token)
        user_profile = sp.current_user()

        user_email = user_profile.get('email')

        if not user_email:
            return jsonify({'error': 'User email not found from Spotify'}), 404

        session['email'] = user_email

        user_doc = mongo_users.find_by_field("email", user_email)
        if not user_doc:
            user_doc = {
                "email": user_email,
                "access_token": access_token,
                "name": user_profile.get('display_name'),
            }
            mongo_users.insert_one(user_doc)
        else:
            mongo_users.update_one(
                {"email": user_email},
                {"$set": {"access_token": access_token}}
            )

        return jsonify({'access_token': access_token, 'email': user_email}), 200
    except Exception as e:
        return jsonify({'error': f'Failed to authenticate with Spotify: {str(e)}'}), 500

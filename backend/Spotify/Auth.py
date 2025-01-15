from flask import Flask, redirect, request, Blueprint, jsonify
import spotipy
from spotipy.oauth2 import SpotifyOAuth
import os
from utils.Mongodb import MongoDB

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
        scope="user-top-read playlist-read-private playlist-read-collaborative"
    )

@spotify_auth_bp.route('/auth', methods=['GET'])
def login():
    auth_url = sp_oauth.get_authorize_url()
    return redirect(auth_url)

@spotify_auth_bp.route('/callback', methods=['POST'])
def callback():
    data = request.json  # Get the JSON data from the request
    code = data.get('code')  # Extract code from JSON

    if not code:
        return jsonify({'error': 'No code provided by Spotify'}), 400

    try:
        token_info = sp_oauth.get_access_token(code)
        access_token = token_info['access_token']

        sp = spotipy.Spotify(auth=access_token)
        user_profile = sp.current_user()

        # Extract profile information
        profile_data = {
            "spotify_id": user_profile["id"],
            "name": user_profile["display_name"],
            "image_url": user_profile["images"][0]["url"] if user_profile["images"] else None,
            "access_token": access_token
        }

        user_doc = mongo_users.find_by_field("spotify_id", user_profile["id"])
        if not user_doc:
            # If the user does not exist, create a new entry
            mongo_users.insert_one({
                "spotify_id": user_profile["id"],
                "spotify_access_token": access_token,
                "spotify_profile": profile_data
            })
        else:
            mongo_users.update_one(
                query={"spotify_id": user_profile["id"]},
                update={"$set": {
                    "spotify_access_token": access_token,
                    "spotify_profile": profile_data
                }}
            )

        return jsonify({'message': 'Spotify authentication successful!', 'access_token': access_token}), 200
    except Exception as e:
        return jsonify({'error': f'Failed to authenticate with Spotify: {str(e)}'}), 500

@spotify_auth_bp.route('/profile', methods=['GET'])
def profile():
    token = request.headers.get('Authorization')
    
    if not token or not token.startswith("Bearer "):
        return jsonify({'error': 'Missing or invalid token'}), 401

    token = token.split(" ")[1]
    user_doc = mongo_users.find_by_field("spotify_access_token", token)
    if not user_doc:
        return jsonify({'error': 'User not found or token invalid'}), 404

    return jsonify({'spotifyProfile': user_doc.get("spotify_profile")}), 200

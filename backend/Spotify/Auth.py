from flask import Flask, redirect, request, url_for, Blueprint, jsonify, current_app
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
    try:
        data = request.json
        if not data:
            current_app.logger.error("No JSON payload received")
            return jsonify({'error': 'Invalid JSON payload'}), 400

        code = data.get('code')
        user_email = data.get('email')

        if not code:
            current_app.logger.error("Missing code in request")
            return jsonify({'error': 'No code provided by Spotify'}), 400

        if not user_email:
            current_app.logger.error("Missing email in request")
            return jsonify({'error': 'User email required in JSON body'}), 400

        if not sp_oauth:
            current_app.logger.error("Spotify OAuth object not initialized")
            return jsonify({'error': 'Spotify OAuth object not initialized'}), 500

        token_info = sp_oauth.get_access_token(code)
        access_token = token_info.get('access_token')
        if not access_token:
            current_app.logger.error("Failed to retrieve access token from Spotify")
            return jsonify({'error': 'Failed to retrieve access token from Spotify'}), 500

        user_doc = mongo_users.find_by_field("email", user_email)
        if not user_doc:
            current_app.logger.error(f"User not found in database: {user_email}")
            return jsonify({'error': 'User not found in database'}), 404

        mongo_users.update_one(
            {"email": user_email},
            {"$set": {"spotify_access_token": access_token}},
        )

        return jsonify({'message': 'Spotify authentication successful!', 'access_token': access_token}), 200
    except Exception as e:
        current_app.logger.error(f"Unhandled exception: {str(e)}")
        return jsonify({'error': f'Unhandled exception: {str(e)}'}), 500
        

@spotify_auth_bp.route('/has-token', methods=['GET'])
def has_spotify_token():
    try:
        user_email = request.args.get('email')

        if not user_email:
            current_app.logger.error("Email parameter is missing in the request")
            return jsonify({'error': 'User email is required as a query parameter'}), 400

        user_docs = mongo_users.find_by_field("email", user_email)

        if isinstance(user_docs, list):
            if len(user_docs) == 0:
                current_app.logger.error(f"No user found with email: {user_email}")
                return jsonify({'error': 'User not found in database'}), 404
            user_doc = user_docs[0]  # Get the first document
        else:
            user_doc = user_docs

        spotify_token = user_doc.get("spotify_access_token")
        if not spotify_token:
            current_app.logger.info(f"No Spotify token found for user: {user_email}")
            return jsonify({'has_token': False}), 200

        current_app.logger.info(f"Spotify token found for user: {user_email}")
        return jsonify({'has_token': True}), 200
    except Exception as e:
        current_app.logger.error(f"Unhandled exception in has_spotify_token: {str(e)}")
        return jsonify({'error': f'Failed to check token status: {str(e)}'}), 500


@spotify_auth_bp.route('/logout', methods=['POST'])
def logout():
    try:
        user_email = request.json.get('email')
        if not user_email:
            current_app.logger.error("Missing email in request")
            return jsonify({'error': 'User email required in JSON body'}), 400

        user_doc = mongo_users.find_by_field("email", user_email)
        if not user_doc:
            current_app.logger.error(f"User not found in database: {user_email}")
            return jsonify({'error': 'User not found in database'}), 404

        mongo_users.update_one(
            {"email": user_email},
            {"$unset": {"spotify_access_token": ""}},
        )

        return jsonify({'message': 'Spotify token removed successfully'}), 200
    except Exception as e:
        current_app.logger.error(f"Unhandled exception: {str(e)}")
        return jsonify({'error': f'Failed to remove Spotify token: {str(e)}'}), 500

from flask import Flask, redirect, request, url_for, Blueprint, jsonify, current_app
import spotipy
from spotipy.oauth2 import SpotifyOAuth
import os
from utils.Mongodb import MongoDB

spotify_bp = Blueprint('spotify', __name__)

mongo_users = MongoDB(db_name="SPS", collection_name="users")

sp_oauth = None

def set_spotify_obj():
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

@spotify_bp.route('/get-music-taste', methods=['GET'])
def get_music_taste_route():
    try:
        user_email = request.args.get('email')

        if not user_email:
            current_app.logger.error("Email parameter is missing in the request")
            return jsonify({'error': 'User email is required as a query parameter'}), 400

        current_app.logger.debug(f"Received email: {user_email}")

        user_docs = mongo_users.find_by_field("email", user_email)

        if isinstance(user_docs, list):
            if len(user_docs) == 0:
                current_app.logger.error(f"No user found with email: {user_email}")
                return jsonify({'error': 'User not found in database'}), 404
            user_doc = user_docs[0]
        else:
            user_doc = user_docs

        spotify_token = user_doc.get("spotify_access_token")
        spotify_token_expiry = user_doc.get("spotify_token_expiry")
        
        if not spotify_token:
            current_app.logger.info(f"No Spotify token found for user: {user_email}")
            return jsonify({'has_token': False}), 200
        
        if spotify_token_expiry and spotify_token_expiry < time.time():
            current_app.logger.debug(f"Spotify token for {user_email} has expired. Renewing token.")
            spotify_token = refresh_spotify_token(user_email)

        music_taste = get_music_taste(spotify_token)

        mongo_users.update_one(
            {"email": user_email},
            {"$set": {"music_taste": music_taste}},
        )

        return jsonify({'music_taste': music_taste}), 200

    except Exception as e:
        current_app.logger.error(f"Error getting music taste: {str(e)}")
        return jsonify({'error': f'Failed to get music taste: {str(e)}'}), 500

def refresh_spotify_token(user_email):
    # Get user's current refresh token from the database
    user_doc = mongo_users.find_by_field("email", user_email)
    refresh_token = user_doc.get("spotify_refresh_token")

    if not refresh_token:
        raise ValueError("No refresh token found for user.")

    new_token_info = sp_oauth.refresh_access_token(refresh_token)

    # Save the new access token and its expiry
    new_access_token = new_token_info['access_token']
    expires_in = new_token_info['expires_in']
    new_expiry = time.time() + expires_in

    mongo_users.update_one(
        {"email": user_email},
        {"$set": {
            "spotify_access_token": new_access_token,
            "spotify_token_expiry": new_expiry
        }},
    )

    return new_access_token

def get_music_taste(spotify_token):
    music_taste_set = set()

    sp = spotipy.Spotify(auth=spotify_token)
    top_tracks = sp.current_user_top_tracks(limit=25, offset=0, time_range='medium_term')

    for track in top_tracks['items']:
        track_name = track['name']
        music_taste_set.add(track_name)

        # Add the album name
        album_name = track['album']['name']
        music_taste_set.add(album_name)

        for artist in track['artists']:
            artist_name = artist['name']
            music_taste_set.add(artist_name)

            # Fetch artist details to get genres
            artist_details = sp.artist(artist['id'])
            artist_genres = artist_details.get('genres', [])

            # Add genres to the music taste set
            for genre in artist_genres:
                music_taste_set.add(genre)

    print(list(music_taste_set))
    return list(music_taste_set)
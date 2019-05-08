# auth.google.py
# Route for logging in with Google login tokens

import flask
import requests

from tmeit_backend import models
from tmeit_backend.auth import tmeit_jwt


google_blueprint = flask.Blueprint('google_blueprint', __name__)


@google_blueprint.route('/api/google-login', methods=['POST'])
def google_login():
    """
        Log in a user by receiving a POST with a Google single-sign-on token, and respond with a JWT.

        Details about verifying a Google "id_token" JWT:

        We don't want to bother tracking google's current public key for JWT signing, so we just use Google's Oauth2
        tokeninfo API, at the cost of some performance on user login.
        https://developers.google.com/identity/sign-in/web/backend-auth#verify-the-integrity-of-the-id-token
        TODO: We could track Google's public key and verify tokens locally for a performance boost on login requests

    """

    # Check request and read in Google token
    if not flask.request.is_json:
        return flask.jsonify(msg="Bad Request"), 400  # Request didnt have JSON or XML data, invalid format

    google_jwt = flask.request.json.get("access_token")  # Read token

    if google_jwt is None:
        return flask.jsonify(msg="No token found"), 400  # No token in JSON payload

    # Validate token with Google service
    r = requests.get("https://oauth2.googleapis.com/tokeninfo?id_token=" + google_jwt)

    if r.status_code == 400 and r.json()['error'] == "invalid_token":
        return flask.jsonify(msg="This Google JWT is invalid."), 401

    if r.status_code != requests.codes.ok:
        return flask.jsonify(msg="Error verifying JWT on Google's servers.",
                             reason=r.reason), 502  # HTTP error using Google's verification API

    validated_token = r.json()

    if validated_token['aud'] != flask.current_app.config['GOOGLE_CLIENT_ID']:
        return flask.jsonify(msg="This Google JWT is not ours. Stealing is wrong!"), 401

    # Check if user exists
    if models.Member.query.get(validated_token['email']) is None:  # User isn't registered with TMEIT with that email
        return flask.jsonify(msg="{} ({}) is not registered".format(validated_token['name'],
                                                                    validated_token['email'])
                             ), 403

    # Return our TMEIT authentication JWT
    access_token = tmeit_jwt.generate_jwt(user={
                                                    'email':    str.lower(validated_token['email']),
                                                    'name':     validated_token['name']
                                                })

    return flask.jsonify(access_token=access_token), 200

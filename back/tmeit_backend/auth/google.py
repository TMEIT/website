# auth.google.py
# Handles Google login tokens

import flask
import requests

from tmeit_backend.auth import errors


def verify_google_token(token: str):
    """ Takes a Google JWT "id_token", verifies it, and returns the user's email if the token was valid.

        We don't want to bother tracking google's current public key for JWT signing, so we just use Google's Oauth2
        tokeninfo API, at the cost of some performance on user login.
        https://developers.google.com/identity/sign-in/web/backend-auth#verify-the-integrity-of-the-id-token
        TODO: We could track Google's public key and verify tokens locally for a performance boost on login requests

        Raises:
            InvalidExternalTokenError: Token is signed incorrectly, not from Google, expired, the wrong audience, or
                does not contain an email claim. Token is not usable.
            requests.exceptions.RequestException: An HTTP error occurred while verifying the token with Google.

        Returns:
            A dict containing the logging-in user's email and full name, obtained from their login token
    """
    r = requests.get("https://oauth2.googleapis.com/tokeninfo?id_token=" + token)

    # Raise if Google says token is invalid
    if r.status_code == 400 and r.json()['error'] == "invalid_token":
        raise errors.InvalidExternalTokenError("This Google JWT is invalid.")

    # Raise if we had an HTTP error aside form an invalid token
    r.raise_for_status()

    # Check that token matches our Client ID and isn't stolen from another service.
    validated_token = r.json()
    if validated_token['aud'] != flask.current_app.config['GOOGLE_CLIENT_ID']:
        raise errors.InvalidExternalTokenError("This Google JWT is not ours. Stealing is wrong!")

    return {'email':   validated_token['email'],
            'name':    validated_token['name']}

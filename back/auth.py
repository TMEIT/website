import datetime
import dateutil.parser

import jwt

import sqlalchemy

# load secret from secret_file
with open('jwt_secret.txt') as secret_file:
    secret = secret_file.read()
if len(secret) < 30:
    raise RuntimeError("jwt_secret.txt is too weak.")

# Load in an optional global cutoff date for JWT tokens
try:
    with open('jwt_expired_date.txt') as expired_date_file:
        expired_date = dateutil.parser.parse(expired_date_file.read())
except FileNotFoundError:
    expired_date = None

# issuer field for our JWT tokens
ISSUER = 'TraditionsMEsterIT'


def login():
    """Accepts a user's login token and grants jwt token to stay logged in.

    Throws exceptions if the token is invalid or if the user is not registered.
    """

    # TODO accept and validate SAML and OAUTH tokens
    email = 'joe@gmail.com'

    payload = {
        'iss': ISSUER,  # Token Issuer
        'iat': datetime.datetime.utcnow(),  # Token Issue Time
        'sub': email,  # Token Recipient
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=90)  # Token Expiration Time
    }

    return jwt.encode(payload, secret, algorithm='HS256')


def verify_token(token: str, member_model) -> str:
    """ Verifies an incoming JWT token and returns the user's Email address.

    Issuer must match the issuer string defined in the {ISSUER} constant. Issue and Expiration timestamps are given a
    60-second leeway to allow for clock skew.
    We do not accept tokens made before the cutoff date set in jwt_expired_date.txt, which allows us to expire all
    old tokens if needed.

    Raises:
        jwt.exceptions.InvalidTokenError: Token received is not valid. Note that this function will mainly throw a
            subclass of this exception.
    """

    # pyJWT does validation for us, and we select validation settings here.
    decoded_token = jwt.decode(jwt, secret, issuer=ISSUER, leeway=60, algorithms='HS256')

    # Check the token's issue time if we have a cutoff date set
    if expired_date is not None:
        token_issue_time = decoded_token['iss']
        if datetime.utcfromtimestamp(token_issue_time) < expired_date:
            raise jwt.exceptions.ExpiredSignatureError()

    #TODO: validate email address from token

    return decoded_token['sub']

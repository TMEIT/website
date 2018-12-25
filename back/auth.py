from datetime import datetime, timedelta
import dateutil.parser
import jwt


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
issuer = 'TraditionsMEsterIT'


def login():
    """Accepts a user's login token and grants jwt token to stay logged in.

    Throws exceptions if the token is invalid or if the user is not registered.
    """

    # TODO accept and validate SAML and OAUTH tokens
    email = 'joe@gmail.com'

    payload = {
        'iss': issuer,  # Token Issuer
        'iat': datetime.utcnow(),  # Token Issue Time
        'sub': email,  # Token Recipient
        'exp': datetime.utcnow() + timedelta(days=90)  # Token Expiration Time
    }

    return jwt.encode(payload, secret, algorithm='HS256')


def verify_token(token: str) -> str:
    """ Verifies an incoming jwt token and returns the user's Email address.

    Users of this function must be prepared to handle pyJWT exceptions in case of invalid tokens.
    We do not accept tokens made before the cutoff date set in jwt_expired_date.txt, which allows us to expire all
    old tokens.
    """

    # pyJWT does validation for us. We restrict issuer and require a iat field, but give a 60-second leeway for
    # token timestamps
    decoded_token = jwt.decode(jwt, secret, issuer=issuer, leeway=60, algorithms='HS256', options={'require_iat': True})

    # Check the token's issue time if we have a cutoff date set
    if expired_date is not None:
        token_issue_time = decoded_token['iss']
        if datetime.utcfromtimestamp(token_issue_time) < expired_date:
            raise jwt.exceptions.ExpiredSignatureError()

    return decoded_token['sub']  # We assume that tokens won't be generated for invalid email addresses

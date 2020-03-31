from functools import wraps
import flask


def json_required(f):
    """
    Wrapper for flask views to require json-formatted requests.

    We generally require JSON formatted requests on all views, even with GETs, to make it easier to authenticate
    requests. Clients can add authentication by adding an 'auth' key, and this backend can check the auth key without
    checking the format. Obviously, we need JSON-formatted requests with POSTs anyways.
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not flask.request.is_json:
            return flask.jsonify({"msg": "Requests must be in JSON format."}), 400
        return f(*args, **kwargs)

    return decorated_function

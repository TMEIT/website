import os

from .. import deps, database
from ..auth import JwtAuthenticator


# Create SQLAlchemy engine and db connection pool to be shared across requests.
# Requires that POSTGRES_PASSWORD envvar is set.
db_url = database.get_production_url()
engine = database.get_async_engine(db_url)
async_session = database.get_async_session(engine)

jwt_authenticator = JwtAuthenticator(secret_key=os.environ['JWT_KEY'])

get_db = deps.DatabaseDependency(async_session=async_session)
get_current_user = deps.CurrentUserDependency(async_session=async_session,
                                              jwt_authenticator=jwt_authenticator)

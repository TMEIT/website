import flask
import flask_sqlalchemy
import flask_restless

import models
from auth import login

# Create the Flask application and the Flask-SQLAlchemy object.
app = flask.Flask(__name__)
app.config['DEBUG'] = True
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.sqlite3'


# Init Flask-SQLAlchemy
db = flask_sqlalchemy.SQLAlchemy(app)

# Generate our data models
api_models = models.generate_models(db)

# Create references to our models
Workteam = api_models['workteam']
Member = api_models['member']


# Create the Flask-Restless API manager
manager = flask_restless.APIManager(app, flask_sqlalchemy_db=db)

# Create API endpoints with our models, which will be available at /api/<tablename> by
# default. Allowed HTTP methods can be specified as well
manager.create_api(Workteam, methods=['GET'])
manager.create_api(Member, methods=['GET'])

# start the flask loop
if __name__ == '__main__':
    app.run()

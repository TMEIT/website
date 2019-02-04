class Config(object):
    DEBUG = False
    TESTING = False
    SQLALCHEMY_TRACK_MODIFICATIONS = False


class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///database.sqlite3'


class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = None  # Set at runtime by conftest.py

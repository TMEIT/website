# tmeit_backend.models
This sub-package contains the SQLAlchemy models that define how our data is stored in the database. 
If you want to store new kinds of data in the database, you can do it here.

## READ THIS BEFORE YOU MAKE CHANGES TO THE MODELS
Note that if you change these models, you need to update the schema in the database to match. 
(i.e if you add a new field to Member, you need to add a new column to the "members" table to store that data.)

We have a system for updating the database schema using SQLAlchemy's [Alembic](https://alembic.sqlalchemy.org/en/latest/) library. 
This library updates the database schema using instructions from Django-style "migrations". 
Our Alembic configuration is stored in `db_migrations/` at the root of this repository.

## Our migration system
You can see the current migration "instruction files" in `db_migrations/versions/`. 
These migration files are able to create all the tables for our app. 
You can start with a fresh, empty database, run all the migrations from start to finish, 
and end up with a fully laid-out database, ready to run our app in production. (Albeit with no data stored) 
Updating the database schema from a previous version is as easy as running the latest migrations,
and the schema will be updated, preserving the data inside.

## Generating new migrations
See `db_migrations/README.md` for how to generate migration files when you have made changes to the models. 

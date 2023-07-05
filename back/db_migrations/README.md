# Alembic database migrations

## How database migrations work
When you change the ORM model code for the database in the backend, you need to update the schema in the database to match. 
(i.e if you add a new field to Member in the backend, you need to add a new column to the "members" table to store that data.)

This directory contains a system for updating the database schema using SQLAlchemy's 
[Alembic](https://alembic.sqlalchemy.org/en/latest/) library. 
This library updates the database schema using instructions from Django-style "migrations". 

## Our migration system
You can see the current migration "instruction files" in `db_migrations/versions/`. 
These migration files are able to create all the tables for our app. 
You can start with a fresh, empty database, run all the migrations from start to finish, 
and end up with a fully laid-out database, ready to run our app in production. (Albeit with no data stored) 
Updating the database schema from a previous version is as easy as running the latest migrations,
and the schema will be updated, preserving the data inside.

## Generating new migrations
It is possible to [write migration files by hand](https://alembic.sqlalchemy.org/en/latest/tutorial.html#create-a-migration-script),
but it's pretty complicated. Instead, it's better to let Alembic analyze the models and generate migrations for you.

Autogenerating migrations requires a specific dev environment, 
since Alembic needs to compare the current database schema with the desired schema in your dev-branch code.
The best way to do this is to generate the migrations against the dev environment, 
and run Alembic outside of a container on your local computer.

I have made a bash script to do this, which port-forwards the database in the dev environment to localhost and runs Alembic.
In order to run this script, you must have the dev environment running, 
and you need to have the poetry and the backend installed in a virtual environment on your local machine, 
This can be done by running `poetry install` with `back/` as your working directory,
and then activating the venv in your shell with `poetry shell`.
Then, once you're in the poetry shell,
you can run the script by running `scripts/autogen_migrations.sh` with `back/db_migrations` as your working directory.

If you are creating a new model, make sure that the model is imported in the module file models/__init__.py,
so that the model is initialized when running Alembic

## Generating a test database
The `create-test-db` kubernetes Job runs on every deploy of the dev environment, 
deleting all tables in the dev database and creating new ones populated with test data.

If you want to add more test data or the database schema has changed, 
update the code in `back/db_migrations/scripts/create_test_database.py` and `back/tmeit_backend/testing_data` to match.

## Running migrations in production
Migrations are tested in PR in the "test migrations" Job, 
using the OCI container defined by `containerfiles/test-migrations.Containerfile`.

Migrations are applied in production by the "run-migrations" kubernetes Job, 
which is defined in `deploy/tmeit-jlh-name/run-migrations/`, 
and uses the OCI container defined by `containerfiles/tmeit-run-migrations.Containerfile`

An init container called "wait-for-migrations" on the app pods pause the deployment of new app pods until the migrations are completed.
This ensures that new versions of the app don't start serving requests before the migrations are fully applied and start
returning 500s for missing data.

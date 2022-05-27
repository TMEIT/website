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
and you need to have the poetry and the backend installed in a virtual enviroment on your local machine, 
see Poetry's documentation on how to do that.

To run the script, run `db_migrations/scripts/autogen_migrations.sh` with `back/` as your working directory.

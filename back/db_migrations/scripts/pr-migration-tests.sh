#!/bin/bash

export POSTGRES_HOSTNAME=postgres
export POSTGRES_PORT=5432
export POSTGRES_PASSWORD=test

# Run create_test_database to run all migrations with dummy data
echo Running create_test_database.py
/code/.venv/bin/python scripts/create_test_database.py

# Check if someone forgot to generate migrations
echo Checking for missing migrations
/code/.venv/bin/alembic-autogen-check

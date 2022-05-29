#!/bin/bash

export POSTGRES_HOSTNAME=localhost
export POSTGRES_PORT=5432
export POSTGRES_PASSWORD=test

# Run create_test_database to run all migrations with dummy data
/code/.venv/bin/python scripts/create_test_database.py check-missing-migrations

# Check if someone forgot to generate migrations
/code/.venv/bin/alembic-autogen-check

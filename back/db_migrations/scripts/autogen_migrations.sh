#!/bin/bash

# This generates migrations for the database
# Run from the back/ directory

# You must have your tilt environment running for this to work
# You also need poetry installed on your machine, and the backend dependencies installed to your current virtualenv

# Password in url must be same as deploy/dev/kustomization.yaml
export SQLALCHEMY_DATABASE_URL='postgresql+asyncpg://tmeit_backend:HBXOHEc6TpkquVHKy2zmSeUIEaUFvW@localhost:5432/tmeit_backend'

echo "Enter a short comment about what you're changing in this migration"
read -r COMMENT

alembic -c alembic.ini revision --autogenerate -m "$COMMENT"

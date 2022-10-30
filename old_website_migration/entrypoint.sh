# Start mysql server
docker-entrypoint.sh mariadbd &

# Wait for mysql to start up
sleep 10

# Import db dump
mysql --execute="CREATE DATABASE tmeit;"
mysql tmeit < /dbdump.sql

# password for dev environment, see deploy/kubernetes/dev/kustomization.yaml
export POSTGRES_HOSTNAME=localhost
export POSTGRES_PASSWORD=HBXOHEc6TpkquVHKy2zmSeUIEaUFvW

# Migrate data to new db
/code/.venv/bin/python -m tmeit_backend.old_website_migrate_script

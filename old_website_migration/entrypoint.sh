docker-entrypoint.sh mariadbd &
mysql --execute="CREATE DATABASE tmeit;"
mysql tmeit < /dbdump.sql

/code/.venv/bin/python tmeit_backend/old_websiite_migrate_script.py

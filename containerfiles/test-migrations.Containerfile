FROM create-test-db
RUN /code/.venv/bin/pip install alembic-autogen-check
COPY back/db_migrations/scripts/pr-migration-tests.sh /code/
CMD ["/code/pr-migration-tests.sh"]

#!/usr/bin/env sh
set -e

echo "Waiting for Postgres at $DB_HOST:$DB_PORT ..."

# Wait until Postgres is ready to accept connections
until pg_isready -h "$DB_HOST" -p "$DB_PORT" -q; do
      sleep 0.5
done


echo "PostgreSQL started"

echo "Running migrations"
python manage.py migrate --noinput

echo "Collecting static"
python manage.py collectstatic --noinput

echo "Starting Gunicorn"
exec gunicorn backend.wsgi:application \
   --bind 0.0.0.0:8000 \
   --workers 3
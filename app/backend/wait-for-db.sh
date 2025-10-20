#!/bin/sh

set -e

echo "Waiting for Postgres at $DB_HOST:$DB_PORT ..."

until pg_isready -h "$DB_HOST" -p "$DB_PORT" -q; do
      sleep 0.1
done


echo "PostgreSQL started"
exec "$@"
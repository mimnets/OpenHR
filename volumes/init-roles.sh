#!/bin/bash
# ============================================================
# OpenHR — PostgreSQL Role Passwords
# Runs after Supabase init scripts. Sets passwords on service
# roles that the Supabase image creates without passwords.
# Must use supabase_admin (superuser) — postgres user is not
# a superuser in the Supabase PG image.
# ============================================================
set -e

PGPASS="${POSTGRES_PASSWORD:-openhr-postgres-dev}"

# Wait for pg to be fully ready (init scripts may still be running)
until pg_isready -U postgres; do
    sleep 1
done

# Use supabase_admin (superuser) — its password IS set to POSTGRES_PASSWORD
export PGPASSWORD="$PGPASS"

psql -U supabase_admin -d postgres -v ON_ERROR_STOP=1 <<SQL
ALTER ROLE supabase_auth_admin WITH PASSWORD '${PGPASS}' LOGIN;
ALTER ROLE supabase_storage_admin WITH PASSWORD '${PGPASS}' LOGIN;
ALTER ROLE supabase_replication_admin WITH PASSWORD '${PGPASS}' LOGIN;
ALTER ROLE authenticator WITH PASSWORD '${PGPASS}' LOGIN;
SQL

echo "[init-roles] Service role passwords set successfully."

# PostgreSQL Switch Note

This scaffold is SQLite-first for MVP speed and offline-friendly local development.

To switch to PostgreSQL:
1. Set `DB_CLIENT=postgres` and `POSTGRES_URL=...` in `.env`.
2. Apply `schema.postgres.sql` to your Postgres database.
3. Replace SQLite model queries with async `pg` queries (same table shapes are preserved).

The schema and environment knobs are included so backend teams can migrate persistence without changing API contracts.

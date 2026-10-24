# API database rules (FreelanceManager)

Read this before touching SQL (DAO queries), migrations, database constraints, driver settings, or the configured database itself. Work that only changes validation, controllers or response shapes does not need it.

Like `conventions.md` in this folder, this file describes what the code does **today**. If a rule here contradicts the code, trust the code, report the mismatch, and fix this file when your task touches that rule.

## 1. Data safety

- The configured database is the one in `apps/api/.env`. It is the only database the repo configures, and its rows are real data. Tests roll back (`tests/setup.ts`); nothing else does.
- Never UPDATE, DELETE, backfill or reset rows there. Never run a `down` migration against it. The only schema change you may apply to it is `npm run migrate` (up) for a migration your task adds, after the counts in section 4.
- Probe it read-only: `SELECT`, or statements inside a transaction you roll back. Use a short node script with `pg` and `dotenv`; `psql` is not on PATH.

## 2. SQL

- Always parameterized. Never concatenate values.
- Inserts that depend on a parent use `INSERT ... SELECT ... FROM <parent> WHERE <parent>.id = ... AND <parent>.userId = ...`. Not `WHERE EXISTS`.
- SQL lives in the DAO's query object (`daoQueries`). Constants are named for what they hold (`clientExists` for an existence check, `getJobsByClient` for the list). A parent-existence check plus a list is two queries by design.
- Search uses `ILIKE ... ESCAPE` with a single backslash character. The SQL that reaches PostgreSQL contains `ESCAPE '\'`; inside a JS string literal that is written `'\\'`. A two-character escape string is rejected (`22025`).
- Money sums and subtractions happen in SQL, never with JavaScript arithmetic.
- Every new or changed statement must be executed by a test, or by a probe you recorded in the report. A statement no test reaches is unverified: an invalid `ESCAPE` clause passes typecheck and lint.

## 3. Driver boundary

- `numeric` columns arrive as strings. Convert them to numbers once, at the DAO or mapper boundary.
- `date` columns arrive as raw `YYYY-MM-DD` strings (type parser for OID 1082). Never build a local-time `Date` from them.
- Money request values are already validated numbers. Display formatters such as `formatValueToFloat` parse pt-BR strings and must not prepare a value for a database write.

## 4. Migrations

- Add a new migration after the existing ones. Never rewrite one that is committed or applied elsewhere; add a new one instead, and ask if that seems impossible.
- Every migration has a working `down` that removes only what `up` added and does not drop tables or alter data.
- Before adding constraints or changing types, run read-only counts per affected column (NULLs, duplicates, out-of-range values). Record them at the start of the task.
- If rows conflict, the migration fails loudly. Never invent defaults or convert missing data into valid-looking data.
- After applying: check the `pgmigrations` entry and the resulting column types and nullability with a read-only probe.
- `up` and `down` are verified on an isolated database or schema only if the repo provides tooling for it. Otherwise report "up/down not exercised: no isolated database". Never claim a rollback you did not run.

## 5. When a migration or query is blocked

- **Your migration conflicts with schema, fixtures or test setup:** fix the migration, fixtures or setup yourself and report what changed.
- **Existing rows conflict (the data problem):** stop on that part only. Record table, column and row count. Mark the dependent behaviors `blocked`. Give the options (backfill with a named value, remove rows, relax the contract) with tradeoffs and a recommendation. Finish everything that does not depend on the decision (migration file, tests, code), so approving one option is the only step left.

## 6. Tests for database behavior

- Test SQL-level behavior where it runs: through the API against the database, at a constraint, or at the error handler. A schema-only test does not prove an endpoint uses the schema.
- Constraint changes: tests proving required columns reject `NULL` and nullable columns accept it.
- Search escaping: `%`, `_` and `\` each match literally, in both the list and the count query.
- Money sums: concrete expected values (`0.10 + 0.20` gives exactly `0.30`), not only that a field exists.

## 7. Review focus (database)

In addition to the API review focus, check:

- Suspicious SQL was executed, not only read.
- Money and dates cross the driver boundary as described in section 3, wherever they are touched.
- Migrations are reversible, safe with existing data, present in the worktree and applied to the configured database.
- Nothing wrote rows to, reset, or ran `down` against the configured database. Applying the task's own migration up is allowed.
- Error responses do not leak database detail.

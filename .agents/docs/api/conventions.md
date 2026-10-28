# API conventions (FreelanceManager)

Read by the implementer and reviewer for work in `apps/api` and `packages/shared`.

This file describes what the code does **today**. It must never describe planned or undecided behavior. Planned work lives in `.agents/plans/` (git-ignored). If a rule here contradicts the code, trust the code, report the mismatch, and fix this file when your task touches that rule. When your change creates, changes or removes a rule listed here, update this file in the same change. Items marked (verify) were inferred and not confirmed.

## 1. Stack and layout

- Monorepo. `apps/api`: Express 5, TypeScript, Zod, PostgreSQL through node-postgres, Vitest and Supertest. `packages/shared`: Zod schemas shared with the frontend (`schemas/<entity>`). `packages/legacy-frontend`: legacy, out of scope.
- Layers: routes, controller, service, DAO. Do not skip a layer.
- Entities live in `apps/api/src/entities/<entity>/` (`routes.ts`, `controller.ts`, `services.ts`, `dao.ts`, `types.ts`, `tests/`). Features live in `apps/api/src/features/<feature>/` (`auth`, `dashboard`).
- Each routes file creates its own router and mounts it on the app at `"/"`. Errors are handled by the central error handler registered in `loaders/routes.ts`.
- Folder and file names are lowercase. Imports must match the git-tracked casing exactly: development is on Windows, which hides casing bugs that break on Linux.
- Dynamic updates build their `SET` clause with `dynamicFieldsBuilder` (`utils/dynamic-fields-builder.ts`).
- SQL, migrations, database constraints and the configured database have their own rules in `.agents/docs/api/database.md`. Read it before touching any of them.

## 2. Commands (repo root)

Shell on the dev machine is Windows PowerShell: chain commands with `;`, not `&&`. Paths after `--` are relative to `apps/api`.

- Typecheck: `npm run typecheck -w apps/api`. Whole API, incremental. Final gate only.
- Lint, touched files: `npm run lint -w apps/api -- <paths>`. Lint is type-aware and slow; never lint the whole workspace unless asked. Do not use `--cache`: type-aware results depend on other files, so a cache can go stale.
- Selected specs: `npm run test -w apps/api -- --run <paths>`
- Full API suite: `npm run test:api` (runs once and exits)
- Dates: `npm run test:dates -w apps/api`. Only when dates, the formatter or the shared date schemas change.
- Migrate up: `npm run migrate`. Read `.agents/docs/api/database.md` first.
- Pre-existing problems unrelated to a task (verify): a lint error in `remove-undefined.ts` (unused `_`), and many lint errors in the legacy `public/js`. Report them, never fix them inside an unrelated task.

### Which check for which change

| Change | Run |
|---|---|
| One entity (schema, DAO, service, controller) | That entity's spec. Every new behavior is reached by a test. |
| Shared Zod schema | The specs of every entity that uses it. |
| Dates | `test:dates`. |
| SQL or migration | The entity spec, plus the checks in `.agents/docs/api/database.md`. |
| Test helpers or setup, middleware, error handler, shared code other than entity schemas | Full suite. |
| End of task | Typecheck and lint on touched files. Full suite only if a row above calls for it; the reviewer runs it once otherwise. |

## 3. Contract in effect

- No valid cookie: 401.
- Malformed UUID or invalid body: 400.
- Nonexistent resource or another user's resource: 404, same status and body for both.
- Page beyond the last: 200 with an empty list and pagination metadata (`totalPages`). Invalid page values: 400.
- Error messages are not part of the contract unless a test says so.
- Request body schemas are strict: unknown fields are rejected with 400.
- PATCH bodies must contain at least one defined field. Optional fields use `undefined` to leave
  a value unchanged and `null` to clear it; empty strings are rejected after trimming.
- Strings are trimmed at schema validation time, except passwords, which preserve whitespace.
- All create endpoints return 201. Client updates return the persisted database row.
- User logins are case-sensitive and unique, with both a service pre-check and a database unique index.
- Money columns use `numeric(12,2)` and are converted from PostgreSQL strings at DAO mapper boundaries.
- Money inputs are finite, positive, at most `99999.99`, and limited to two decimal places.
- Job and payment request dates are strict `YYYY-MM-DD` calendar-date strings. PostgreSQL date columns use the raw string parser.
- Job, material and payment responses format money as `pt-BR` strings; job and payment responses format dates as `DD/MM/YYYY`. Dashboard profit is a signed `pt-BR` money string. Response schemas describe these serialized values, not their request or database representations.
- Search patterns escape `\`, `%`, and `_`, and the query uses `ILIKE ... ESCAPE` with a single backslash character (details in `.agents/docs/api/database.md`).
- `clients.address` and `materials.supplier` may be `null`; other required entity fields may not be
  `null`. Omitted optional edit fields remain unchanged, while explicit `null` clears only nullable
  fields.

## 4. Authentication and ownership

- `authenticate` (`features/auth/middlewares/authentication.ts`) verifies the JWT cookie and validates its payload with Zod. Controllers read the user with `requireUser(req)` (`features/auth/require-user.ts`). Do not use `req.user!` or `req.user?.`.
- Ownership is enforced in SQL. Every query on user-owned data filters by `userId`. Nested resources (materials, payments) filter through their parent job, and jobs through their client.
- `userId` is a required separate argument of DAO methods that read, edit or delete owned data. `id` and `userId` never go into a dynamic `SET` clause.
- Creating under a parent verifies the parent's owner inside the insert. Zero rows inserted becomes `NotFoundError`.
- Ownership is enforced in DAO queries; per-entity ownership middlewares are not used. Do not add new ones.
- Route middleware order is validate, authenticate, then the controller. Do not reorder without a decision.
- A missing `userId` must fail closed. `undefined` must never reach a query.

## 5. SQL style

Moved to `.agents/docs/api/database.md` (section 2), together with the migration and data-safety rules.

## 6. Errors

- Use the classes in `entities/errors/errors.ts` (not-found, unauthorized, and so on). Services throw them and controllers do not repeat the checks.
- Postgres `23505` maps to 409 and `23503` to 400. Other database errors reach the generic 500 handler.
- Postgres `22003` and `22007` map to a generic 400 response; database details are logged server-side only.
- Never expose raw database detail in a response.

## 7. Tests

- Each test runs inside a transaction that is rolled back (`apps/api/tests/setup.ts` replaces `pool.query`). Production code must not use `pool.connect` or another client, or rollback stops covering it.
- Spec files run in parallel. Do not depend on shared mutable state between tests (module-level agents, cookie jars, fixtures).
- Setup helpers (`registerAndLogin`, `createTestClient`, ...) assert a 2xx and an `id` and fail with an error naming the step. Factories (`makeClient`, `makeJob`, ...) return fresh objects. Only the user login is unique per call, so build an object once and reuse it instead of calling a factory twice and expecting equal values.
- Layout: entity specs in `entities/<entity>/tests/`, cross-cutting specs (authorization, route lists) in `features/auth/tests/`.
- One behavior per test, Arrange/Act/Assert, named by behavior.
- Assert the specific expected value (status 404), never only that two responses match. Use valid bodies so a 400 or 404 cannot come from validation by accident. Add a positive control where a test claims something is hidden. After a rejected write, check the owner's data is unchanged.
- Table tests (`it.each`) use explicit rows and no branching in the test function. Route lists have a completeness guard that fails when a registered route is missing from the table.
- Change an existing test only when its expectation belonged to behavior your change intentionally replaced, and say so in the report. Never weaken, skip or delete a test to make it pass.

## 8. Review focus (API)

In addition to the general review, check:

- Every query on owned data has the `userId` predicate, and nested resources resolve ownership through the parent. A forgotten predicate is must-fix.
- A foreign resource behaves exactly like a nonexistent one. A request cannot set `id` or `userId`.
- A new or changed route: authentication present, a row in the route-list tests, and the completeness guard still meaningful.
- SQL, migrations, database state, and how money and dates cross the driver boundary: apply the review focus in `.agents/docs/api/database.md`.
- Error responses do not leak database detail.
- Test isolation: rollback still covers new queries, no new shared state, no collisions between files running in parallel.
- Import and path casing.

## 9. Workflow

- Plans, backlogs and notes live in `.agents/plans/`, which is git-ignored (local only). Everything else under `.agents/` is not ignored.
- Git actions (branch, commit, push, merge) happen only when the request asks, through the `git-workflow` skill (`.agents/skills/git-workflow/SKILL.md`).

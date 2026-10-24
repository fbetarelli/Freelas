# FreelanceManager

Freelance work manager (clients, jobs, materials, payments, dashboard). npm workspace monorepo.

- `apps/api`: Express 5, TypeScript, Zod, PostgreSQL (node-postgres), Vitest and Supertest.
- `packages/shared`: Zod schemas shared with the frontend.
- `packages/legacy-frontend`: legacy EJS frontend. Out of scope unless asked.

## Read before changing code

- API or shared code: `.agents/docs/api/conventions.md`.
- SQL, migrations, database constraints, or anything that touches the database: also `.agents/docs/api/database.md`. Read it before starting, not after.
- Frontend: no dedicated conventions file currently exists; follow the patterns of the existing code and say so.
- Plans and backlogs live in `.agents/plans/` (git-ignored). Read one only when the request points to it.

## Commands (repo root, Windows PowerShell: chain with `;`, not `&&`)

- Selected specs: `npm run test -w apps/api -- --run <paths relative to apps/api>`
- Full API suite: `npm run test:api`
- Typecheck: `npm run typecheck -w apps/api`
- Lint, touched files only: `npm run lint -w apps/api -- <paths relative to apps/api>`

The conventions file is the source of truth for commands and for which check to run for which kind of change. If this list and the conventions disagree, follow the conventions and report the mismatch.

## Rules that always apply

- A behavior without a test is not done. Write tests with the change.
- Pick checks with the conventions' "which check for which change" table. Do not run typecheck, lint or the full suite after every edit.
- The database in `apps/api/.env` holds real data. Never UPDATE, DELETE, backfill or reset rows there, and never run a `down` migration against it. Probe it read-only.
- Never weaken, skip or delete a test to make it pass. Never silence tooling (`eslint-disable`, `@ts-ignore`, `@ts-expect-error`).
- No new dependencies without asking.
- Folder and file names are lowercase, and imports must match the tracked casing exactly (development is on Windows, which hides casing bugs).
- Stay in scope. Report problems outside the task instead of fixing them.
- Do not commit, branch, push or merge unless asked. When asked, use the `git-workflow` skill (`.agents/skills/git-workflow/SKILL.md`).

## Implementer and reviewer procedures

When the request says to work as the implementer, follow `.agents/roles/implementer.agent.md`. When it says to work as the reviewer, follow `.agents/roles/reviewer.agent.md`, in a fresh session, never the one that wrote the code.

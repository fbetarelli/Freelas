// tests/setup.ts
import { pool } from "../src/database/database.ts";
import type { PoolClient } from "pg";
import { beforeEach, afterEach, vi } from "vitest";

let client: PoolClient;

beforeEach(async () => {
  client = await pool.connect(); //make the connection
  await client.query("BEGIN");
  // redirect all DB calls onto that one connection
  vi.spyOn(pool, "query").mockImplementation(
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    client.query.bind(client),
  );
});

afterEach(async () => {
  await client.query("ROLLBACK");
  vi.restoreAllMocks(); // put pool.query back to normal
  client.release(); // give the connection back
});

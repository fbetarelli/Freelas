import { Client } from "pg";
import { afterEach, describe, expect, it } from "vitest";
import { config } from "dotenv";
import {
  downSql,
  upSql,
} from "../../../migrations/1775843000000_numeric_money.mjs";

config();

const clients: Client[] = [];

afterEach(async () => {
  await Promise.all(clients.splice(0).map((client) => client.end()));
});

describe("numeric money migration conversion", () => {
  it("preserves high values and supports the reverse conversion on isolated tables", async () => {
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    clients.push(client);
    await client.connect();
    await client.query("BEGIN");
    await client.query(`
      CREATE TEMP TABLE jobs (totalvalue real);
      CREATE TEMP TABLE payments (value real);
      CREATE TEMP TABLE materials (unitaryval real);
      INSERT INTO jobs VALUES (12345.678);
      INSERT INTO payments VALUES (54321.894);
      INSERT INTO materials VALUES (99999.994);
    `);

    const before = await client.query<{
      totalvalue: number;
    }>("SELECT * FROM jobs");
    const beforeTypes = await getTempTypes(client, "jobs");

    await client.query(upSql);

    const after = await client.query<{ totalvalue: string }>(
      "SELECT * FROM jobs",
    );
    const afterPayments = await client.query<{ value: string }>(
      "SELECT * FROM payments",
    );
    const afterMaterials = await client.query<{ unitaryval: string }>(
      "SELECT * FROM materials",
    );
    const afterTypes = await getTempTypes(client, "jobs");

    expect(beforeTypes).toEqual(["real"]);
    expect(before.rows[0].totalvalue).toBeCloseTo(12345.678, 2);
    expect(afterTypes).toEqual(["numeric(12,2)"]);
    expect(after.rows[0].totalvalue).toBe("12345.68");
    expect(afterPayments.rows[0].value).toBe("54321.89");
    expect(afterMaterials.rows[0].unitaryval).toBe("99999.99");

    await client.query(downSql);

    expect(await getTempTypes(client, "jobs")).toEqual(["real"]);
    expect(await getTempTypes(client, "payments")).toEqual(["real"]);
    expect(await getTempTypes(client, "materials")).toEqual(["real"]);
    await client.query("ROLLBACK");
  }, 30000);
});

const getTempTypes = async (client: Client, table: string) => {
  const result = await client.query<{ type: string }>(
    `SELECT format_type(a.atttypid, a.atttypmod) AS type
     FROM pg_attribute a
     JOIN pg_class c ON c.oid = a.attrelid
     WHERE c.relname = $1
       AND c.relnamespace = pg_my_temp_schema()
       AND a.attnum > 0
     ORDER BY a.attnum`,
    [table],
  );
  return result.rows.map((row) => row.type);
};

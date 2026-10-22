import type { RequestHandler } from "express";
import { assertIsString } from "../utils/assert-is-string.ts";
import { pool } from "../database/database.ts";
import { requireUser } from "../features/auth/require-user.ts";

function authorizeOwnerViaJob(
  table: "materials" | "payments",
  paramName: string,
): RequestHandler {
  return async (req, res, next) => {
    const id = req.params[paramName];
    assertIsString(id, paramName);
    await pool.query<{ userid?: string }>(
      `SELECT jobs.userid FROM ${table} JOIN jobs ON ${table}.jobid = jobs.id WHERE ${table}.id = $1 AND jobs.userid = $2`,
      [id, requireUser(req).id],
    );
    return next();
  };
}

export const authorizeMaterialOwner = authorizeOwnerViaJob(
  "materials",
  "id",
);
export const authorizePaymentOwner = authorizeOwnerViaJob(
  "payments",
  "id",
);

import type { RequestHandler } from "express";
import { assertIsString } from "../utils/assert-is-string.ts";
import { pool } from "../database/database.ts";
import { ForbiddenError } from "../entities/errors/errors.ts";

function authorizeOwnerViaJob(
  table: "materials" | "payments",
  paramName: string,
  entityName: string,
): RequestHandler {
  return async (req, res, next) => {
    const id = req.params[paramName];
    assertIsString(id, paramName);
    const result = await pool.query<{ userid?: string }>(
      `SELECT jobs.userid FROM ${table} JOIN jobs ON ${table}.jobid = jobs.id WHERE ${table}.id = $1`,
      [id],
    );
    const ownerId = result.rows[0]?.userid;
    if (ownerId && req.session.user?.id === ownerId) return next();
    return next(
      new ForbiddenError(
        `Access denied: You do not have permission to access this ${entityName}.`,
      ),
    );
  };
}

export const authorizeMaterialOwner = authorizeOwnerViaJob(
  "materials",
  "id",
  "material",
);
export const authorizePaymentOwner = authorizeOwnerViaJob(
  "payments",
  "id",
  "payment",
);

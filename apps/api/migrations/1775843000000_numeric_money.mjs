export const upSql = `
    ALTER TABLE jobs
      ALTER COLUMN totalvalue TYPE numeric(12,2)
      USING ROUND(totalvalue::double precision::numeric, 2);
    ALTER TABLE payments
      ALTER COLUMN value TYPE numeric(12,2)
      USING ROUND(value::double precision::numeric, 2);
    ALTER TABLE materials
      ALTER COLUMN unitaryval TYPE numeric(12,2)
      USING ROUND(unitaryval::double precision::numeric, 2);
`;

export const downSql = `
    ALTER TABLE jobs
      ALTER COLUMN totalvalue TYPE real
      USING totalvalue::real;
    ALTER TABLE payments
      ALTER COLUMN value TYPE real
      USING value::real;
    ALTER TABLE materials
      ALTER COLUMN unitaryval TYPE real
      USING unitaryval::real;
`;

/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
export const up = (pgm) => {
  pgm.sql(upSql);
};

/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
export const down = (pgm) => {
  pgm.sql(downSql);
};

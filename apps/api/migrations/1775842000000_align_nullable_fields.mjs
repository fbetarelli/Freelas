/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
export const up = (pgm) => {
    pgm.sql(`
        DO $$
        DECLARE
            violating_column text;
        BEGIN
            SELECT table_name || '.' || column_name
            INTO violating_column
            FROM (
                SELECT 'clients' AS table_name, 'contact' AS column_name
                WHERE EXISTS (SELECT 1 FROM clients WHERE contact IS NULL)
                UNION ALL
                SELECT 'jobs', 'jobdate'
                WHERE EXISTS (SELECT 1 FROM jobs WHERE jobdate IS NULL)
                UNION ALL
                SELECT 'jobs', 'descr'
                WHERE EXISTS (SELECT 1 FROM jobs WHERE descr IS NULL)
                UNION ALL
                SELECT 'jobs', 'payed'
                WHERE EXISTS (SELECT 1 FROM jobs WHERE payed IS NULL)
                UNION ALL
                SELECT 'jobs', 'totalvalue'
                WHERE EXISTS (SELECT 1 FROM jobs WHERE totalvalue IS NULL)
                UNION ALL
                SELECT 'payments', 'paymentdate'
                WHERE EXISTS (SELECT 1 FROM payments WHERE paymentdate IS NULL)
                UNION ALL
                SELECT 'payments', 'method'
                WHERE EXISTS (SELECT 1 FROM payments WHERE method IS NULL)
                UNION ALL
                SELECT 'payments', 'value'
                WHERE EXISTS (SELECT 1 FROM payments WHERE value IS NULL)
                UNION ALL
                SELECT 'payments', 'installment'
                WHERE EXISTS (SELECT 1 FROM payments WHERE installment IS NULL)
                UNION ALL
                SELECT 'materials', 'descr'
                WHERE EXISTS (SELECT 1 FROM materials WHERE descr IS NULL)
                UNION ALL
                SELECT 'materials', 'unitaryval'
                WHERE EXISTS (SELECT 1 FROM materials WHERE unitaryval IS NULL)
                UNION ALL
                SELECT 'materials', 'qnt'
                WHERE EXISTS (SELECT 1 FROM materials WHERE qnt IS NULL)
            ) AS null_columns
            LIMIT 1;

            IF violating_column IS NOT NULL THEN
                RAISE EXCEPTION 'Cannot enforce NOT NULL: existing NULL values in %', violating_column;
            END IF;
        END $$;
    `);

    pgm.alterColumn('clients', 'contact', { notNull: true });
    pgm.alterColumn('jobs', 'jobdate', { notNull: true });
    pgm.alterColumn('jobs', 'descr', { notNull: true });
    pgm.alterColumn('jobs', 'payed', { notNull: true });
    pgm.alterColumn('jobs', 'totalvalue', { notNull: true });
    pgm.alterColumn('payments', 'paymentdate', { notNull: true });
    pgm.alterColumn('payments', 'method', { notNull: true });
    pgm.alterColumn('payments', 'value', { notNull: true });
    pgm.alterColumn('payments', 'installment', { notNull: true });
    pgm.alterColumn('materials', 'descr', { notNull: true });
    pgm.alterColumn('materials', 'unitaryval', { notNull: true });
    pgm.alterColumn('materials', 'qnt', { notNull: true });
    pgm.alterColumn('materials', 'supplier', { notNull: false });
};

/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
export const down = (pgm) => {
    pgm.alterColumn('clients', 'contact', { notNull: false });
    pgm.alterColumn('jobs', 'jobdate', { notNull: false });
    pgm.alterColumn('jobs', 'descr', { notNull: false });
    pgm.alterColumn('jobs', 'payed', { notNull: false });
    pgm.alterColumn('jobs', 'totalvalue', { notNull: false });
    pgm.alterColumn('payments', 'paymentdate', { notNull: false });
    pgm.alterColumn('payments', 'method', { notNull: false });
    pgm.alterColumn('payments', 'value', { notNull: false });
    pgm.alterColumn('payments', 'installment', { notNull: false });
    pgm.alterColumn('materials', 'descr', { notNull: false });
    pgm.alterColumn('materials', 'unitaryval', { notNull: false });
    pgm.alterColumn('materials', 'qnt', { notNull: false });
};

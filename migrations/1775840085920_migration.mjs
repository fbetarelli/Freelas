/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
    pgm.createExtension('pgcrypto', { ifNotExists: true })
    pgm.createExtension('unaccent', { ifNotExists: true })

    pgm.createTable('users', {
        id: {
            type: 'UUID', primaryKey: true,
            default: pgm.func('gen_random_uuid()'),
        },
        username: { type: 'varchar(50)', notNull: true },
        login: { type: 'varchar(50)', notNull: true },
        hashpassword: {
            type: 'varchar(100)',
            notNull: true
        },
    });
    pgm.createTable('clients', {
        id: {
            type: 'UUID', primaryKey: true,
            default: pgm.func('gen_random_uuid()'),
        },
        name: { type: 'varchar(50)', notNull: true },
        address: { type: 'varchar(255)' },
        contact: { type: 'varchar(150)' },
        userid: {
            type: 'UUID', references: '"users"(id)',
            onUpdate: 'CASCADE', onDelete: 'CASCADE', notNull: true
        },
    });
    pgm.createTable('jobs', {
        id: {
            type: 'UUID', primaryKey: true,
            default: pgm.func('gen_random_uuid()'),
        },
        jobdate: { type: 'date' },
        descr: { type: 'varchar(150)' },
        payed: { type: 'boolean' },
        totalvalue: { type: 'float' },
        userid: {
            type: 'UUID', references: '"users"(id)',
            onUpdate: 'CASCADE', onDelete: 'CASCADE', notNull: true
        },
        clientid: {
            type: 'UUID', references: '"clients"(id)',
            onUpdate: 'CASCADE', onDelete: 'CASCADE', notNull: true
        },
    });
    pgm.createTable('payments', {
        id: {
            type: 'UUID', primaryKey: true,
            default: pgm.func('gen_random_uuid()'),
        },
        paymentdate: { type: 'date' },
        method: { type: 'varchar(50)' },
        value: { type: 'float' },
        installment: { type: 'int' },

        jobid: {
            type: 'UUID', references: '"jobs"(id)',
            onUpdate: 'CASCADE', onDelete: 'CASCADE', notNull: true
        },
    });
    pgm.createTable('materials', {
        id: {
            type: 'UUID', primaryKey: true,
            default: pgm.func('gen_random_uuid()'),
        },
        descr: { type: 'varchar(50)' },
        supplier: { type: 'varchar(250)' },
        unitaryval: { type: 'float' },
        qnt: { type: 'int' },

        jobid: {
            type: 'UUID', references: '"jobs"(id)',
            onUpdate: 'CASCADE', onDelete: 'CASCADE', notNull: true
        },
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropTable('materials', { cascade: true })
    pgm.dropTable('payments', { cascade: true })
    pgm.dropTable('jobs', { cascade: true })
    pgm.dropTable('clients', { cascade: true })
    pgm.dropTable('users', { cascade: true })

};

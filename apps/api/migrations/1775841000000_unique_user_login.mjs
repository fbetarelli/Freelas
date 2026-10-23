/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
export const up = (pgm) => {
    pgm.createIndex('users', 'login', {
        name: 'users_login_unique',
        unique: true,
    })
}

/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
export const down = (pgm) => {
    pgm.dropIndex('users', 'login', { name: 'users_login_unique' })
}

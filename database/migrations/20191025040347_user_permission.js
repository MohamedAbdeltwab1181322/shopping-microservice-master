exports.up = function(knex) {
    return Promise.all([
        knex.schema.createTable('user_permission', function(table) {
            table.increments().primary();
            table.tinyint('user_id').unsigned();
            table.tinyint('role_id').unsigned();
            table.timestamps();
        })
    ])
};
//Rollback migration
exports.down = function(knex) {
    return Promise.all([
        knex.schema.dropTable('user_permission')
    ])
};
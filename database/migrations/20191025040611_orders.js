exports.up = function(knex) {
    return Promise.all([
        knex.schema.createTable('orders', function(table) {
            table.increments().primary();
            table.integer('user_id').unsigned();
            table.integer('quantity').unsigned()
            table.integer('sub_total').unsigned()
            table.tinyint('new').unsigned()
            table.timestamps();
        })
    ])
};
//Rollback migration
exports.down = function(knex) {
    return Promise.all([
        knex.schema.dropTable('orders')
    ])
};
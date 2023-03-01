const moment = require('moment');

exports.seed = function(knex) {
    return knex('user_role').del()
        .then(function() {

            const createdAt = moment().format('YYYY-MM-DD HH:mm:ss');

            return knex('user_role').insert([{
                role: "admin",
                created_at: createdAt,
                updated_at: createdAt
            }, {
                role: "seller",
                created_at: createdAt,
                updated_at: createdAt
            }, {
                role: "customer",
                created_at: createdAt,
                updated_at: createdAt
            }]);
        });
};
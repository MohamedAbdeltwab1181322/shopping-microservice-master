const moment = require('moment');

exports.seed = function(knex) {
    return knex('user_permission').del()
        .then(function() {
            const createdAt = moment().format('YYYY-MM-DD HH:mm:ss');

            return knex("users").select("id").from("users").where({ "name": 'admin' }).then(data => {

                return knex('user_permission').insert({
                    user_id: data[0].id,
                    role_id: 1,
                    created_at: createdAt,
                    updated_at: createdAt
                });

            })
        });
};
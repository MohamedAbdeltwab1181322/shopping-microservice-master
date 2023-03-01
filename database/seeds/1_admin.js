const moment = require('moment');
const bcrypt = require('bcryptjs');
const saltRounds = 10;

exports.seed = function(knex) {
    return knex('users').del()
        .then(function() {
            const createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
            return knex('users').insert([{
                name: "admin",
                email: "admin@gmail.com",
                password: bcrypt.hashSync(String("admin1234"), saltRounds),
                created_at: createdAt,
                updated_at: createdAt
            }]);
        });
};
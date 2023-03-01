console.log(process.env.DB_HOST, process.env.DB_USER, process.env.DB_PASS, process.env.DB_NAME)
const development = {
    client: 'mysql2',
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: "azima1234" || process.env.DB_PASS,
        database: process.env.DB_NAME
    },
    pool: {
        max: (process.env.DB_MAX_POOL) ? parseInt(process.env.DB_MAX_POOL) : 50,
        min: 1
    },
    migrations: {
        tableName: 'migrations'
    },
    seeds: {
        directory: 'seeds'
    }
}

exports.development = development;
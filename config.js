const sessionSecretKey = process.env.SESSION_SECRET_KEY || 'bfu3ur83ur8brbgb3yrd2jdeh82eu2krtjgoqsnowd2';
const knexConfig =  process.env.NODE_ENV === "production" ?
{
    client: 'pg',
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized : false },
    }
}:
{
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        database: 'chatling',
        port: 5432,
        user: 'postgres',
        password: 'judgementday'
    }
};

const ADMIN_KEY = process.env.ADMIN_KEY || 'testAdminKey';

module.exports = {
    sessionSecretKey,
    knexConfig,
    ADMIN_KEY
}
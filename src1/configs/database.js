module.exports = {
    

    multipleStatements: true,
    host: process.env.MY_DATABASE,
    user: 'pro',
    password: 'Siscom3519',
    timezone: "+00:00",
    database: 'hris_hrm',
    connectionLimit: 1000,
    connectTimeout: 60 * 60 * 1000,
    acquireTimeout: 60 * 60 * 1000,
    timeout: 60 * 60 * 1000,
};
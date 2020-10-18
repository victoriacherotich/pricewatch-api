const {Pool} = require('pg');
require('dotenv').config();
// const api_mysql = require('mysql');


const host= process.env.NODE_ENV === 'production' ? process.env.PROD_DATABASE_HOST : process.env.DEV_DATABASE_HOST;
const database= process.env.NODE_ENV === 'production' ? process.env.PROD_DATABASE_NAME : process.env.DEV_DATABASE_NAME;
const user= process.env.NODE_ENV === 'production' ? process.env.PROD_DATABASE_USER : process.env.DEV_DATABASE_USER;
const password= process.env.NODE_ENV === 'production' ? process.env.PROD_DATABASE_PASSWORD : process.env.DEV_DATABASE_PASSWORD;


const pool = new Pool({ host, user, password, database, });

pool.connect()
    .then(() => console.log(`connected`))
    .catch((error) => console.log(error));


module.exports = pool;
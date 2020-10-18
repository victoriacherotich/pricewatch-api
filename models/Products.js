const pool = require('../database/ConnectionString');

const createProductsTable = async () => {
    try { 
        await pool.query(`
            CREATE TABLE IF NOT EXISTS products(
                products_id SERIAL,
                title VARCHAR(100) NOT NULL,
                price VARCHAR(100) NOT NULL,
                product_description TEXT NULL,
                image TEXT NULL,
                brand VARCHAR(100) NULL,
                category VARCHAR(100) NULL,
                time_joined TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
        `);
    } catch (error) {
        console.log(error);
    };
}
createProductsTable();

module.exports = createProductsTable;
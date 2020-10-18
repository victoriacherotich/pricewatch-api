const pool = require('../database/ConnectionString');

const createCartTable = async () => {
    try { 
        await pool.query(`
            CREATE TABLE IF NOT EXISTS cart(
                cart_id SERIAL,
                public_id VARCHAR(100) NULL,
                products_id INTEGER NOT NULL,
                quantity VARCHAR(10) NOT NULL,
                total_price FLOAT NULL,
                status BOOLEAN DEFAULT false,
                payment VARCHAR(10) DEFAULT 'mpesa',
                time_added_to_cart TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
        `);
    } catch (error) { 
        console.log(error);
    };
}
createCartTable();

module.exports = createCartTable;

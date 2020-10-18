const pool = require('../database/ConnectionString');

const createFavouritesTable = async () => {
    try { 
        await pool.query(`
            CREATE TABLE IF NOT EXISTS favourites(
                favourites_id SERIAL,
                public_id VARCHAR(50) NULL,
                products_id INTEGER NULL,
                time_added_to_favourites TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
        `);
    } catch (error) {
        console.log(error);
    };
}
createFavouritesTable();

module.exports = createFavouritesTable;
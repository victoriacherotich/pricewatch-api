const pool = require('../database/ConnectionString');

const createJoinedTable = async () => {
    try { 
        await pool.query(`
            CREATE TABLE IF NOT EXISTS my_groups(
                my_groups_id SERIAL,
                public_id INT(10) NOT NULL,
                support_group_id INT(10) NOT NULL,
                time_joined TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
        `);
    } catch (error) {
        console.log(error);
    };
}
createJoinedTable();

module.exports = createJoinedTable; 
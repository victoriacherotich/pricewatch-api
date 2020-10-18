require('../models/Favourites')();
const pool = require('../database/ConnectionString');
// const {validateUserProfile, validateUserProfileUpdate} = require('../validations/UserProfilerofileValidation');

class UserProfileController {
    
    static async createFavourite(request, response) {
        const {public_id, products_id} = request.body;
        
        const postResponse = await pool.query(`INSERT INTO favourites(public_id, products_id) VALUES('${public_id}', '${products_id}')`);

        if (postResponse.rowCount === 0) {
            return response.status(400).json({ message: 'Request unsuccessful. Save failed' });
        }else{
            return response.status(200).json({ message: 'Product addd to wishlist!'});
        };
        // const favourites = await pool.query(`SELECT * FROM favourites WHERE public_id='$1' and products_id='$2' `, []);
        // console.log(favourites)
        // if (favourites.rows.length === 0) {
        //     const postResponse = await pool.query(`INSERT INTO favourites(public_id, products_id) VALUES('${public_id}', '${products_id}')`);
        //     if (postResponse.rowCount === 0) {
        //         return response.status(400).json({ message: 'Request unsuccessful. Save failed' });
        //     }else{
        //         return response.status(200).json({ message: 'Product addd to wishlist succesfuly!'});
        //     };
        // }else{
        //     return response.status(200).json({ message: 'Product already in wishlist!'});
        // }


    };

    static async getMyFavourite(request, response) {
        const public_id = request.params.id;
        
        const products = await pool.query(`SELECT * FROM favourites
        LEFT JOIN products ON products.products_id=favourites.products_id
         WHERE favourites.public_id='${public_id}'`);
        //  console.log(products)
        return response.status(200).json(products.rows);
    }

    static async getFavourite(request, response) {
        const sqlFetchRequest = `SELECT * FROM favourites`;
        
        const products = await pool.query(sqlFetchRequest);
        return response.status(200).json(products.rows);
    }

    static async deleteFavourites(request, response) {
        const cart_id = request.params.id;
        const deleteRequest = await pool.query(`DELETE FROM favourites WHERE cart_id='${cart_id}'`);
        
        if (deleteRequest.rowCount == 0) {
            return response.status(400).json({ message: 'Request unsuccessful. Update failed' });
        }else{
            return response.status(200).json({ message: 'Favourite deleted successfully'});
        };
    };

}; 

module.exports = UserProfileController;
require("../models/Cart")();
const pool = require("../database/ConnectionString");
// const {validateUserProfile, validateUserProfileUpdate} = require('../validations/UserProfilerofileValidation');

class UserProfileController {
  static async createCart(request, response) {
    const { products_id, price } = request.body;
    console.log(request.body);

    const postResponse = await pool.query(
      `INSERT INTO cart(public_id, products_id, quantity, total_price)
        VALUES($1, $2, $3, $4)`,
      ["0", products_id, "1", parseFloat(price.replace(',',''))]
    );
    if (postResponse.rowCount == 0) {
      return response
        .status(400)
        .json({ message: "Request unsuccessful. Save failed" });
    } else {
      return response
        .status(200)
        .json({ message: "Products created succesfuly!" });
    }
  }

  static async getMyCart(request, response) {
      const public_id = request.params.id;
    const products = await pool.query(`SELECT * FROM cart LEFT JOIN products 
        ON products.products_id=cart.products_id WHERE cart.public_id='0'`);
    return response.status(200).json(products.rows);
  }

  static async getMyCartCount(request, response) {
    const public_id = request.params.id;
    const products = await pool.query(`SELECT * FROM cart LEFT JOIN products 
    ON products.products_id=cart.products_id WHERE cart.public_id='0'`);
  return response.status(200).json(products.rowCount);
}

  static async getMyCartVer(request, response) {
    const public_id = request.params.id;
    console.log(public_id);
  const products = await pool.query(`SELECT * FROM cart LEFT JOIN products 
      ON products.products_id=cart.products_id WHERE cart.public_id='${public_id}'`);
  return response.status(200).json(products.rows);
}

  static async getAllCart(request, response) {
    const products = await pool.query(`SELECT * FROM cart 
    LEFT JOIN products 
    ON products.products_id=cart.products_id 
    LEFT JOIN user_profile 
    ON user_profile.socket_auth_users_public_id=cart.public_id `);
    return response.status(200).json(products.rows);
  }

  static async getMyCartPrice(request, response) {
    const products = await pool.query(
      `SELECT SUM(total_price) AS newTotal FROM cart WHERE public_id='0'`
    );

    // console.log(products.rows[0].newtotal);
    return response.status(200).json(parseFloat(products.rows[0].newtotal));
  }

  static async deleteCart(request, response) {
    const cartDelete = await pool.query(`DELETE FROM cart WHERE public_id='0'`);

    if (cartDelete.rowCount == 0) {
      return response
        .status(400)
        .json({ message: "Request unsuccessful. Update failed" });
    } else {
      return response
        .status(200)
        .json({ message: "Cart quantity updated succesfuly" });
    }
  }

  static async deleteCartsingle(request, response) {
    const cart_id = request.params.id;

    const cartDelete = await pool.query(
      `DELETE FROM cart WHERE cart_id='${cart_id}'`
    );
    if (cartDelete.rowCount == 0) {
      return response
        .status(400)
        .json({ message: "Request unsuccessful. Update failed" });
    } else {
      return response
        .status(200)
        .json({ message: "Cart quantity updated succesfuly" });
    }
  }

  static async getCart(request, response) {
    const sqlFetchRequest = `SELECT * FROM cart 
        LEFT JOIN products 
        ON products.products_id=cart.products_id
        LEFT JOIN users
        ON users.socket_auth_users_public_id=cart.public_id WHERE cart.status='false'`;

    const products = await pool.query(sqlFetchRequest);
    return response.status(200).json(products.rows);
  }

  static async updateCartProcess(request, response) {
    const cart_id = request.params.id;
    const updateRequest = await pool.query(
      `UPDATE cart SET status=true WHERE cart_id='${cart_id}'`
    );

    if (updateRequest.rowCount == 0) {
      return response
        .status(400)
        .json({ message: "Request unsuccessful. Update failed" });
    } else {
      return response
        .status(200)
        .json({ message: "Cart status updated succesfuly" });
    }
  }

  static async updateCartStatus(request, response) {
    const public_id = request.params.id;
    const updateRequest = await pool.query(
      `UPDATE cart SET public_id='${public_id}' WHERE public_id='0'`
    );


    if (updateRequest.rowCount == 0) {
      return response
        .status(400)
        .json({ message: "Request unsuccessful. Update failed" });
    } else {
      return response
        .status(200)
        .json({ message: "Cart status updated succesfuly" });
    }
  }

  static async updateCartStatustrue(request, response) {
    const cart_id = request.params.id;
    const updateRequest = await pool.query(
      `UPDATE cart SET status='true' WHERE cart_id='${cart_id}'`
    );

    if (updateRequest.rowCount == 0) {
      return response
        .status(400)
        .json({ message: "Request unsuccessful. Update failed" });
    } else {
      return response
        .status(200)
        .json({ message: "Cart status updated succesfuly" });
    }
  }

  static async updateCartQuantity(request, response) {
    const cart_id = request.params.id;
    const { price } = request.body;

    const cartFetch = await pool.query(
      `select quantity FROM cart WHERE cart_id='${cart_id}'`
    );
    const newQuantity = parseFloat(cartFetch.rows[0].quantity) + 1;
    const newprice = newQuantity * parseFloat(price.replace(',',''));

    const updateRequest = await pool.query(
      `UPDATE cart SET quantity='${newQuantity}', total_price='${newprice}' WHERE cart_id='${cart_id}'`
    );

    if (updateRequest.rowCount == 0) {
      return response
        .status(400)
        .json({ message: "Request unsuccessful. Update failed" });
    } else {
      return response
        .status(200)
        .json({ message: "Cart quantity updated succesfuly" });
    }
  }

  static async removeCartQuantity(request, response) {
    const cart_id = request.params.id;
    const { price } = request.body;
    // console.log(price);

    const cartFetch = await pool.query(
      `select quantity FROM cart WHERE cart_id='${cart_id}'`
    );
    const newQuantity = parseFloat(cartFetch.rows[0].quantity) - 1;
    console.log(newQuantity);
    const newprice = newQuantity * parseFloat(price.replace(',',''));
    console.log(newprice);

    const updateRequest = await pool.query(
      `UPDATE cart SET quantity='${newQuantity}', total_price='${newprice}' WHERE cart_id='${cart_id}'`
    );

    if (updateRequest.rowCount == 0) {
      return response
        .status(400)
        .json({ message: "Request unsuccessful. Update failed" });
    } else {
      return response
        .status(200)
        .json({ message: "Cart quantity updated succesfuly" });
    }
  }
}

module.exports = UserProfileController;

require("../models/Products")();
const pool = require("../database/ConnectionString");
const axios = require("axios");

class UserProfileController {
    static async crawlAndSaveHuddahProducts(request, response) {
        await axios
        .get("http://localhost:2500/api/crawler/huddah")
        .then(function(products) {
            // response.json(products.data);

            let jsondata = products.data;

            for (var i = 0; i < jsondata.length; i++) {
            // console.log(jsondata[i].img.src);
            const postResponse = pool.query(
                `INSERT INTO products(
                        title, price, image, brand, category
                    ) VALUES(
                        '${jsondata[i].title}','${jsondata[i].price}','${jsondata[i].img.src}', 'Huddah', ''
                    )`
            );
            }
            return response
            .status(200)
            .json({ message: "Products created successfully!" });
        })
        .catch(function(error) {
            console.log(error);
        });
    }

    static async crawlAndSaveJoannaProducts(request, response) {
        await axios
        .get("http://localhost:2500/api/crawler/joanna")
        .then(function(products) {
            // response.json(products.data);

            let jsondata = products.data;

            for (var i = 0; i < jsondata.length; i++) {
            // console.log(jsondata[i].img.src);
            const postResponse = pool.query(
                `INSERT INTO products(title, price, image, brand, category) VALUES('${jsondata[i].title}','${jsondata[i].price}','${jsondata[i].img.src}', 'Joanna', '')`
            );
            }
            return response
            .status(200)
            .json({ message: "Products created successfully!" });
        })
        .catch(function(error) {
            console.log(error);
        });
    }
    static async crawlAndSaveJoylipsProducts(request, response) {
        await axios
        .get("http://localhost:2500/api/crawler/joylips")
        .then(function(products) {
            // response.json(products.data);

            let jsondata = products.data;

            for (var i = 0; i < jsondata.length; i++) {
            // console.log(jsondata[i].img.src);
            const postResponse = pool.query(
                `INSERT INTO products(title, price, image, brand, category) VALUES('${jsondata[i].title}','${jsondata[i].price}','${jsondata[i].img.src}', 'Joylips', '')`
            );
            }
            return response
            .status(200)
            .json({ message: "Products created successfully!" });
        })
        .catch(function(error) {
            console.log(error);
        });
    }
    static async crawlAndSaveCanvasProducts(request, response) {
        await axios
        .get("http://localhost:2500/api/crawler/canvas")
        .then(function(products) {
            let jsondata = products.data;

            for (var i = 0; i < jsondata.length; i++) {
                // console.log(jsondata[i].img.src);
                const postResponse = pool.query(
                    `INSERT INTO products(title, price, image, brand, category) VALUES('${jsondata[i].title}','${jsondata[i].price}','${jsondata[i].img.src}', 'Canvas', '')`
                );
            } 
            return response
            .status(200)
            .json({ message: "Products created successfully!" });
        })
        .catch(function(error) {
            console.log(error);
        });
    }
    static async crawlAndSaveLagirlProducts(request, response) {
        await axios
        .get("http://localhost:2500/api/crawler/lagirl")
        .then(function(products) {
            // response.json(products.data);

            let jsondata = products.data;

            for (var i = 0; i < jsondata.length; i++) {
            // console.log(jsondata[i].img.src);
            const postResponse = pool.query(
                `INSERT INTO products(title, price, image, brand, category) VALUES('${jsondata[i].title}','${jsondata[i].price}','${jsondata[i].img.src}', 'Lagirl', '')`
            );
            }
            return response
            .status(200)
            .json({ message: "Products created successfully!" });
        })
        .catch(function(error) {
            console.log(error);
        });
    }
    static async getAllProducts(request, response, err) {
        const products = await pool.query(`SELECT * FROM products`);
        return response.status(200).json(products.rows);
    }

    static async productCount(request, response) {
        const brand = request.params.id;
        const products = await pool.query(`SELECT * FROM products WHERE brand='${brand}' `);
      return response.status(200).json(products.rowCount);
    }

    static async getAllProductsFilter(request, response, err) {
        const {max, min} = request.body;
        console.log(request.body)
        const products = await pool.query(`SELECT * FROM products WHERE price < ${max} AND price > ${min} `);
        return response.status(200).json(products.rows);
    }

    static async getSingleProducts(request, response, err) {
        const products_id= request.params.id;
        const products = await pool.query(`SELECT * FROM products WHERE products_id='${products_id}' `);
        return response.status(200).json(products.rows);
    }

    static async getAllProductsCompared(request, response, err) {
        const brand = request.params.id;
        const category = request.params.value;
        console.log(brand);
        console.log(category)

        const products = await pool.query(`SELECT * FROM products WHERE brand!='${brand}' AND category='${category}' `);
        return response.status(200).json(products.rows);
    }

    static async getAllProductsBrands(request, response, err) {
        try {
            const brands = [
                'Joylips', 'Joanna', 'Canvas', 'Huddah'
            ];
            const categories = { lips: '', eyes: 'eye', face: 'face' };

            const scrapPromises = [];
            for(let brand of brands){
                for(let [cat, catq] of Object.entries(categories)){
                    if(brand === 'Huddah' && catq !== ''){
						continue;
					}
                    scrapPromises.push(fetchBrandCategory(brand, cat, catq));
                }
            }
            await Promise.all(scrapPromises);

            function fetchBrandCategory(brand, cat, catq) {
                return new Promise(async (resolve) => {
                    const { rows } = await pool.query(
                        `SELECT brand, category FROM products 
                            WHERE brand = '${brand}' AND category = '${cat}'`
                    );
                    if (rows[0]) {
                        return resolve();
                    }
                    // console.log(rows);
                    axios
                        .get(`http://localhost:2500/api/crawler/${brand.toLowerCase()}?q=${catq}`)
                        .then(async function (products) {
                            let jsondata = products.data;

                            const qs = [];
                            for (var i = 0; i < jsondata.length; i++) {
                                qs.push(pool.query(
                                    `INSERT INTO products(
                                        title, price, image, brand, category
                                    ) VALUES (
                                        '${jsondata[i].title}','${jsondata[i].price}',
                                        '${jsondata[i].img.src}', '${brand}', '${cat}'
                                    )`
                                ))
                            }
                            await Promise.all(qs);
                            resolve();
                        })
                        .catch(function (error) {
                            console.error(error);
                            resolve();
                        });
                })
            }
        } catch (err) {
            console.error(err);
        }
        const products = await pool.query(`SELECT brand FROM products GROUP BY brand`);

        return response.status(200).json(products.rows);
    }


static async getAllBrandsProducts(request, response, err) {
    const brand = request.params.id;
    const products = await pool.query(`SELECT * FROM products WHERE brand='${brand}' `);
    return response.status(200).json(products.rows);
}

    static async getAllProductsCategories(request, response, err) {
        const products = await pool.query(`SELECT category FROM products GROUP BY category`);
        return response.status(200).json(products.rows);
    }

    static async getAllCategoriesProducts(request, response, err) {
        const category = request.params.id;
        const products = await pool.query(`SELECT * FROM products WHERE category='${category}' `);
        return response.status(200).json(products.rows);
    }

    static async updateSingleProduct(request, response) {
        const products_id = request.params.id;
        const { price, product_description, category } = request.body;

        const updateRequest = await pool.query(
        `UPDATE products SET price=$1, product_description=$2, category=$3 WHERE products_id='${products_id}'`,
        [price, product_description, category]
        );
        // {price, product_description}
        
        if (updateRequest.rowCount == 0) {
        return response
            .status(400)
            .json({ message: "Request unsuccessful. Update failed" });
        } else {
        return response
            .status(200)
            .json({ message: "Product updated successfully" });
        }
    }

    static async deleteSingleProduct(request, response) {
        const products_id = request.params.id;
        // console.log(products_id);
        // const socket_auth_user_file = request.file.path;
        await pool.query(`DELETE FROM products WHERE  products_id='${products_id}' `);
        return response.status(201).json({ message: "Uploaded" });
    }
}

module.exports = UserProfileController;

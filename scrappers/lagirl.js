const cheerio = require('cheerio');
const request = require('request');

function search(item){
    return new Promise((resolve, reject) => {
    const url= `https://www.lagirlusa.com/search?q=%3F`

        request(url, (err, resp, body) => {
            if (err){
                return reject(err);
            }
        
            const $ = cheerio.load(body);
            const products = $('div.products-grid.col-xs-12').children().map((i, elm) => {
                const product = {
                    title: $(elm).find('div.grid-product__title a').text(), 
                    price: $(elm).find('div span.grid-product__price').text().match(/\d+\.\d+/)[0] * 100, 
                    img: {
                        // src: $(elm).find('a.grid-product__image-link lazy-trigger img').attr('src'),
                        src: $(elm).find('img.grid-product__image').attr('src'),
                        alt: $(elm).find('img.grid-product__image').attr('alt'),
                    }
                }

                
                product.img.alt = product.title;

                return product;
            }).toArray();
      
        console.log(products)
            resolve(products);
        });
    });
};
 

module.exports.search = search;
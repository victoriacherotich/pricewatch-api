const cheerio = require('cheerio');
const request = require('request');

function search(item){
    return new Promise((resolve, reject) => {
       // const url= `http://zaron.com.ng/search?q=${item}&type=product`
        const url= `https://www.canvascosmetic.com/?s=${item}&post_type=product`
        
        request(url, (err, resp, body) => {
            if (err){
                return reject(err);
            }
        
            const $ = cheerio.load(body);
            const products = $('ul.products').children().map((i, elm) => {
                const product = {
                    title: $(elm).find('h2 a').text(), 
                    price: $(elm).find('ins span.amount').text().match(/(\d|\.|,)+/g) || 
                        $(elm).find('span.price span.amount').text().match(/(\d|\.|,)+/g), 
                    img: {
                        src: $(elm).find('div.product_thumbnail img').attr('src'),
                        alt: $(elm).find('div.product_thumbnail img').attr('alt')
                    }
                }

                product.price = (product.price || ['[Sold Out]'])[0];

                return product;
            }).toArray();
                    
            resolve(products);
        });
    })
}

module.exports.search = search;
const cheerio = require('cheerio');
const request = require('request');

function search(item){
    return new Promise((resolve, reject) => {
        const url= `https://joannakcosmetics.com/search?q=${item}&type=product`
        request(url, (err, resp, body) => {
            if (err){
                return reject(err);
            }
        
            const $ = cheerio.load(body);
            const products = $('#product-loop').children().map((i, elm) => {
                const product = {
                    title: $(elm).find('.product-info .prod-title').text(), 
                    price: $(elm).find('.product-info .prod-price .money').text().match(/(\d|\.|,)+/g), 
                    img: {
                        src: $(elm).find('.prod-image img').attr('src'),
                        alt: $(elm).find('.prod-image img').attr('alt')
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
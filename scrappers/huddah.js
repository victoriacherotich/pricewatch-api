const cheerio = require('cheerio');
const request = require('request');

function search(item){
    return new Promise((resolve, reject) => {
       const url= `https://huddahstore.com/search?post_type=product&q=${item}`
      
        request(url, (err, resp, body) => {
            if (err){
                return reject(err);
            }
        
            const $ = cheerio.load(body);
            const products = $('ul.list-view-items').children().map((i, elm) => {
                const product = {
                    title: $(elm).find('span.product-card__title').text(), 
                    price: $(elm).find('span.price-item.price-item--regular').text().match(/(\d|\.|,)+/g), 
                    img: {
                        src: $(elm).find('img').attr('src'),
                        alt: $(elm).find('img').attr('alt')
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
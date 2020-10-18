const cheerio = require('cheerio');
const request = require('request');

function search(item){
    return new Promise((resolve, reject) => {
        const url= `https://www.joylips.com/?s=${item}&post_type=product`
        request(url, (err, resp, body) => {
            if (err){
                return reject(err);
            }
        
            const $ = cheerio.load(body);
            const products = $('div.products').children().map((i, elm) => {
                const product = {
                    title: $(elm).find('p.name a').text(), 
                    price: $(elm).find('span.price span.amount').text().match(/(\d)+/g), 
                    img: {
                        src: $(elm).find('img').attr('src'),
                        
                    }
                }
                product.img.alt = product.title;
                product.price = (product.price || ['[Sold Out]'])[0];
                const kesPrice = Number(product.price) * 100;
                if(kesPrice){
                    product.price = kesPrice;
                }	
			
                return product;
            }).toArray();
                    
            resolve(products);
        });
    })
}

module.exports.search = search;
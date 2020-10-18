const express = require("express");
const router = express.Router();
const ProductCrawlerController = require('../controllers/ProductCrawlerController');
const authenticate = require('../middleware/auth');

router.get('/v1/huddah/', ProductCrawlerController.crawlAndSaveHuddahProducts);
router.get('/v1/joanna/', ProductCrawlerController.crawlAndSaveJoannaProducts);
router.get('/v1/joylips/', ProductCrawlerController.crawlAndSaveJoylipsProducts);
router.get('/v1/canvas/', ProductCrawlerController.crawlAndSaveCanvasProducts);
// router.get('/v1/lagirl/', ProductCrawlerController.crawlAndSaveLagirlProducts);

router.get('/v1/allproducts/', ProductCrawlerController.getAllProducts);



router.get('/v1/allproductsfilter/', ProductCrawlerController.getAllProductsFilter);


router.get('/v1/singleProducts/:id', ProductCrawlerController.getSingleProducts);
router.get('/v1/compareProduct/:id/:value', ProductCrawlerController.getAllProductsCompared);
router.get('/v1/allbrands/', ProductCrawlerController.getAllProductsBrands);

router.get('/v1/productCount/:id', ProductCrawlerController.productCount);


router.get('/v1/specificbrands/:id', ProductCrawlerController.getAllBrandsProducts);
router.get('/v1/allcategories/', ProductCrawlerController.getAllProductsCategories);
router.get('/v1/specificcategories/:id', ProductCrawlerController.getAllCategoriesProducts);
router.patch('/v1/:id', ProductCrawlerController.updateSingleProduct);
router.delete('/v1/:id', ProductCrawlerController.deleteSingleProduct);

module.exports = router;
const express = require("express");
const router = express.Router();
const CartController = require('../controllers/CartController');
const authenticate = require('../middleware/auth');

router.post('/v1/', CartController.createCart);
router.get('/v1/mycart/', CartController.getMyCart);
router.get('/v1/mycartcount/', CartController.getMyCartCount);
router.get('/v1/mycart/:id', CartController.getMyCartVer);

router.get('/v1/allcart/', CartController.getAllCart);
router.get('/v1/mycartTotal/', CartController.getMyCartPrice);
router.delete('/v1/deletecart/', CartController.deleteCart);
router.delete('/v1/deletecartsingle/:id', CartController.deleteCartsingle);

router.get('/v1/', CartController.getCart);
router.patch('/v1/:id', CartController.updateCartStatus);
router.patch('/v1/processed/:id', CartController.updateCartStatus);

router.patch('/v1/processedtrue/:id', CartController.updateCartStatustrue);

router.patch('/v1/quantity/:id', CartController.updateCartQuantity);
router.patch('/v1/quantityminus/:id', CartController.removeCartQuantity);

module.exports = router;
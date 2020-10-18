const express = require("express");
const router = express.Router();
// const CartController = require('../controllers/CartController');
// const authenticate = require('../middleware/auth');


const joanna = require('../scrappers/joanna');
const joylips=require('../scrappers/joylips');
const canvas = require('../scrappers/canvas');
const huddah= require('../scrappers/huddah');

// router.post('/v1/', authenticate, CartController.createCart);
// router.get('/v1/:id', CartController.getMyCart);
// router.get('/v1/', CartController.getCart);
// router.patch('/v1/:id', authenticate, CartController.updateCartStatus);

router.get('/joanna', async (req, res) => {
    const item = req.query.q || 'lipstick';
    const joannaRes = await joanna.search(item);
    res.send(joannaRes);
});
router.get('/joylips', async (req, res) => {
    const item = req.query.q || 'lipstick';
    const joylipsRes = await joylips.search(item);
    res.send(joylipsRes);
});
router.get('/canvas', async (req, res) => {
    const item = req.query.q || 'lipstick';
    const canvasRes = await canvas.search(item);
    res.send(canvasRes);
});
router.get('/huddah', async (req, res) => {
    const item = 'lipstick';
    const huddahRes = await huddah.search(item);
    res.send(huddahRes);
});



module.exports = router;
const express = require("express");
const router = express.Router();
const FavouritesController = require('../controllers/FavouritesController');
const authenticate = require('../middleware/auth');

router.post('/v1/', FavouritesController.createFavourite);
router.get('/v1/favourites/:id', FavouritesController.getMyFavourite);
router.get('/v1/:id', FavouritesController.getFavourite);
router.delete('/v1/:id', FavouritesController.deleteFavourites);

module.exports = router;
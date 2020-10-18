const express = require("express");
const path = require('path')
const cors = require('cors');
const app = express();
const helmet = require("helmet");
const compression = require("compression");
const bodyParser = require("body-parser");
const error = require("./middleware/error");
require("dotenv").config();
require("express-async-errors");

const registration = require("./routes/UserRegistration");
const auth = require("./routes/Auth");
const profile = require("./routes/UserProfile");
const cart = require("./routes/Cart");
const favourites = require("./routes/Favourites");
const productCrawler = require("./routes/ProductCrawler");
const crawler = require("./routes/Crawler");

app.use(cors());
app.options('*', cors())

app.use(bodyParser.json());
app.use(express.json());
app.use(helmet());
app.use(compression());
app.use("/uploads", express.static('uploads'));
app.use("/api/registration", registration);
app.use("/api/auth", auth);
app.use("/api/profile", profile);
app.use("/api/cart", cart);
app.use("/api/favourites", favourites);
app.use("/api/productCrawler", productCrawler);
app.use("/api/crawler", crawler);

app.use(error);
// const port = process.env.PORT || 3000;
const port = 2500 ;
const server = app.listen(`${port}`);

module.exports = server;
"use strict";
const compression = require("compression")
const express = require("express");
const app = express();
const brotli = require('brotli');
// const shrinkRay = require('shrink-ray-current');

app.set("views", "view");
app.set("view engine", "ejs");



app.use(compression());
app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'max-age=' + 365 * 24 * 60 * 60); next();
});
// app.use(shrinkRay({
//     cache: () => false, cacheSize: false, filter: () => true, brotli: {
//         quality: 6 // between 1 and 11
//     }, zlib: {
//         level: 6 // between 1 and 9
//     }
// }));
app.use(express.static('public'))

app.get("/", index)

app.listen(3000);
console.log("Server is Listening on port 3000");

function index(req, res) {
    res.render("index")
}


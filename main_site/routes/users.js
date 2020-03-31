var express = require('express');
var router = express.Router();
var inventory = require('../models/inventory');
var projects = require('../models/projects');

/* GET users listing. */
router.get('/', function(req, res, next) {
  inventory.find({}, function(err, products) {
    console.log(products);
    res.render('admin', { products: products });
  });
});

module.exports = router;

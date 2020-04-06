var express = require('express');
var router = express.Router();
// var inventory = require('../models/inventory');
// var projects = require('../models/projects');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('admin');
  });

module.exports = router;

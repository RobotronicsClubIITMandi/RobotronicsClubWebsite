var express = require('express');
var router = express.Router();
var Inventory = require('../models/inventory');
var News = require('../models/news');
var Projects = require('../models/projects');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//--------club inventory page----------
router.get('/inventory', function(req, res, next) {
  Inventory.find({}).select('-_id').exec( function(err, result){
    console.log(result);
    res.render('inventory_2', {array: result});
  });
});


//-----notifications page---------
router.get('/notifications', function(req, res, next) {
  News.find({}).select('-_id').exec( function(err, result){
    console.log(result);
    res.render('notifications', {data: result})
  })
});


//---------projects page --------------
router.get('/projects', function(req, res, next) {
  res.render('projects', { title: 'Express' });
});

router.get('/admin', function(req, res, next) {
  News.find({},function(err, result){
    console.log(result);
    res.render('admin', { product: result });
  });
});

module.exports = router;

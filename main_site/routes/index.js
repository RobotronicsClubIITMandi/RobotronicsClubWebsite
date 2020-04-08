var express = require('express');
var router = express.Router();
var Inventory = require('../models/inventory');
var News = require('../models/news');
var Projects = require('../models/projects');

var async = require('async');


/* GET home page. */
router.get('/', function (req, res, next) {
  async.parallel({
    inventory: function(callback){
      Inventory.find({},callback);
    },
    projects: function(callback){
      Projects.find({},callback);
    },
    news: function(callback){
      News.find({},callback);
    }
  }, function(err, results){
    console.log(results);
    res.render('index',{news: results['news'], inventory: results['inventory'], projects: results['projects']});
  });
});

//--------club inventory page----------
router.get('/inventory', function (req, res, next) {
  Inventory.find({}).select('-_id').exec(function (err, result) {
    console.log(result);
    res.render('inventory_2', { array: result });
  });
});


//-----notifications page---------
router.get('/notifications', function (req, res, next) {
  News.find({}).select('-_id').exec(function (err, result) {
    console.log(result);
    res.render('notifications', { data: result });
  });
});


//---------projects page --------------
router.get('/projects', function (req, res, next) {
  Projects.find({}).select('-id').exec(function (err, result) {
    console.log(result);
    res.render('projects', { data: result});
  });
});

router.get('/admin', function (req, res, next) {
  News.find({}, function (err, result) {
    console.log(result);
    res.render('admin', { product: result });
  });
});

module.exports = router;

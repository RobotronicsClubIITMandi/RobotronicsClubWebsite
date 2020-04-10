var express = require('express');
var router = express.Router();
var Inventory = require('../models/inventory');
var News = require('../models/news');
var Projects = require('../models/projects');

var async = require('async');


/* GET home page. */
router.get('/', function (req, res, next) {
  async.parallel({
    inventory: function (callback) {
      Inventory.find({}, callback);
    },
    projects: function (callback) {
      Projects.find({}, callback);
    },
    news: function (callback) {
      News.find({}, callback);
    }
  }, function (err, results) {
    console.log(results);
    res.render('index', { news: results['news'], inventory: results['inventory'], projects: results['projects'] });
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
    res.render('projects', { data: result });
  });
});


//---------admin page-----------
router.get('/admin', function (req, res, next) {
  async.parallel({
    inventory: function (callback) {
      Inventory.find({}, callback);
    },
    projects: function (callback) {
      Projects.find({}, callback);
    },
    news: function (callback) {
      News.find({}, callback);
    }
  }, function (err, results) {
    console.log(results);
    res.render('admin', { news: results['news'], inventory: results['inventory'], projects: results['projects'] });
  });
});

//----------inventory forms-----------
router.get('/inventory/create', function (req, res, next) {
  res.render('inventory_form', { action: "Create", results: 0, del: 0 })
})

router.post('/inventory/create', function (req, res, next) {
  var component = new Inventory(
    {
      name: req.body.name,
      total: req.body.total,
      available: req.body.available,
      price: req.body.price
    }
  );
  component.save(function (err) {
    if (err) { return next(err); }
    res.redirect('../admin');
  })
})

router.get('/inventory/:id/delete', function (req, res, next) {
  var id = req.params.id;
  Inventory.find({ _id: id }).exec(function (err, results) {
    console.log(results);
    res.render('inventory_form', { action: "Delete", results: results, del: 1 });
  });
})

router.post('/inventory/:id/delete', function (req, res, next) {
  Inventory.findByIdAndRemove(req.params.id, function deleteComponent(err) {
    if (err) { return next(err); }
    // Success - go to author list
    res.redirect('../../admin')
  });
})

router.get('/inventory/:id/update', function (req, res, next) {
  var id = req.params.id;
  Inventory.find({ _id: id }).exec(function (err, results) {
    console.log(results);
    res.render('inventory_form', { action: "Update", results: results, del: 0 });
  });
})

router.post('/inventory/:id/update', function (req, res, next) {
  var component = new Inventory(
    {
      name: req.body.name,
      total: req.body.total,
      available: req.body.available,
      price: req.body.price,
      _id: req.params.id
    }
  );
  Inventory.findByIdAndUpdate(req.params.id, component, {}, function (err, thecomponent) {
    if (err) { return next(err); }
    res.redirect('../../admin');
  });
});

module.exports = router;

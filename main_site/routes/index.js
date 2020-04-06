var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//--------club inventory page----------
router.get('/inventory', function(req, res, next) {
  res.render('inventory', { title: 'Express' });
});


//-----notifications page---------
router.get('/notifications', function(req, res, next) {
  res.render('notifications', { title: 'Express' });
});


//---------projects page --------------
router.get('/projects', function(req, res, next) {
  res.render('projects', { title: 'Express' });
});

router.get('/admin', function(req, res, next) {
  res.render('admin', { title: 'Express' });
});

module.exports = router;

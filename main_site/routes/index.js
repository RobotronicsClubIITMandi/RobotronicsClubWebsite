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


//----------news forms-----------
router.get('/news/create', function (req, res, next) {
  res.render('news_form', { action: "Create", results: 0, del: 0 })
})

router.post('/news/create', function (req, res, next) {
  var component = new News(
    {
      title: req.body.title,
      content: req.body.content,
      date_created: req.body.date_created
     
    }
  );
  component.save(function (err) {
    if (err) { return next(err); }
    res.redirect('../admin');
  })
})

router.get('/news/:id/delete', function (req, res, next) {
  var id = req.params.id;
  News.find({ _id: id }).exec(function (err, results) {
    console.log(results);
    res.render('news_form', { action: "Delete", results: results, del: 1 });
  });
})

router.post('/news/:id/delete', function (req, res, next) {
  News.findByIdAndRemove(req.params.id, function deleteComponent(err) {
    if (err) { return next(err); }
    // Success - go to author list
    res.redirect('../../admin')
  });
})

router.get('/news/:id/update', function (req, res, next) {
  var id = req.params.id;
  News.find({ _id: id }).exec(function (err, results) {
    console.log(results);
    res.render('news_form', { action: "Update", results: results, del: 0 });
  });
})

router.post('/news/:id/update', function (req, res, next) {
  var component = new News(
    {
      title: req.body.title,
      content: req.body.content,
      date_created: req.body.date_created,
      _id: req.params.id
    }
  );
  News.findByIdAndUpdate(req.params.id, component, {}, function (err, thecomponent) {
    if (err) { return next(err); }
    res.redirect('../../admin');
  });
});

//----------projects forms-----------
router.get('/projects/create', function (req, res, next) {
  res.render('projects_form', { action: "Create", results: 0, del: 0 })
})

router.post('/projects/create', function (req, res, next) {
  var component = new Projects(
    {
      name: req.body.name,
      description:req.body.description,
      mentor: req.body.mentor,
      team:req.body.team,
      
      date_of_creation:req.body.date_of_creation
     
    }
  );
  component.save(function (err) {
    if (err) { return next(err); }
    res.redirect('../admin');
  })
})

router.get('/projects/:id/delete', function (req, res, next) {
  var id = req.params.id;
  Projects.find({ _id: id }).exec(function (err, results) {
    console.log(results);
    res.render('projects_form', { action: "Delete", results: results, del: 1 });
  });
})

router.post('/projects/:id/delete', function (req, res, next) {
  Projects.findByIdAndRemove(req.params.id, function deleteComponent(err) {
    if (err) { return next(err); }
    // Success - go to author list
    res.redirect('../../admin')
  });
})

router.get('/projects/:id/update', function (req, res, next) {
  var id = req.params.id;
  Projects.find({ _id: id }).exec(function (err, results) {
    console.log(results);
    res.render('projects_form', { action: "Update", results: results, del: 0 });
  });
})

router.post('/projects/:id/update', function (req, res, next) {
  var component = new Projects(
    {
      name: req.body.name,
      description:req.body.description,
      mentor: req.body.mentor,
      team:req.body.team,
      
      date_of_creation:req.body.date_of_creation,
      _id: req.params.id
    }
  );
  Projects.findByIdAndUpdate(req.params.id, component, {}, function (err, thecomponent) {
    if (err) { return next(err); }
    res.redirect('../../admin');
  });
});

module.exports = router;

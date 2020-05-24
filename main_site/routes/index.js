var express = require('express');
var router = express.Router();
var Inventory = require('../models/inventory');
var News = require('../models/news');
var Projects = require('../models/projects');
var Issues = require('../models/issues');

var async = require('async');

/* Middleware Function to check is Logged in */
// For use where Admin login is required
function isLoggedIn(req, res, next){
  // Do any checks you want to do

  // Check if the user is logged in or not
  if(req.session.islogin){
    return next();  // This continues the request as the user is logged in!
  }

  // Redirect if the user is not logged in
  res.redirect('/admin/login');
};


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
router.get('/admin', isLoggedIn, function (req, res, next) {
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
    res.render('admin', { news: results['news'], inventory: results['inventory'], projects: results['projects'], user: req.session.user });
  });
});

/* ---------- Admin Login Page --------- */
router.get('/admin/login', function(req, res, next){
  // Checking if it is loggined before or not
  if(req.session.islogin){
   res.redirect('/admin'); //If he is logged in
  }
  res.render('login.ejs', { flashMessage: "" });

});

router.post('/admin/login', function(req, res, next){
  // Checking if it is loggined before or not
  if(req.session.islogin){
    res.redirect('/admin'); // If he is already logged in
  }
  // Login User
  var un = req.body.username;
  var passwd = req.body.password;
  
  // Now check condition
  if(un==='admin' && passwd==='admin'){
    req.session.islogin=true;
    req.session.user=un;
    res.redirect('/admin');  // Redirect him to admin page after successfull login
  } else{
    res.render('login.ejs', { flashMessage: "Invalid Login!" });
  }
});

/* For admin to view his details stored */
router.get('/admin/me', isLoggedIn, function(req, res, next){
  res.status(200)
    .json({ islogin: req.session.islogin, user: req.session.user });
});

/* -------- Logout ------------ */
router.get('/admin/logout', function(req, res, next){
  // If logined, then logout
  if(req.session.islogin){
    req.session = null;
    console.log("session cleared");
    res.redirect('/admin/login');
  } else{
    res.render('login.ejs', { flashMessage: "Please Login First!" });
  }
  
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

/* REST APIs to handle Issues */
// status: "Requested" - create ,"Return-Pending" - accept, "Returned" - clear
/* Example
  {
    "items": {},
    "_id": "5ec7ef28846e22263826c1b1",
    "name": "Priyam",
    "email": "test@test.com",
    "status": "Returned",
    "date_of_issue": "2020-05-22T00:00:00.000Z",
    "__v": 0
  }
*/
/*
For a normal user:
/issues/create
/issues/myissues

For only admins
/issues/all // Get the list of all the issues
/issues/:id/accept // Accepting the issue - sets the status to "returned"
/issues/:id/delete // To remove from the database
/issues/:id/reject // Not deleting just setting the status to rejected  // Not implemented
*/

/**
 * API TO create a new issue with status "requested"
 * Send name, email, items in the JSON Body in the POST Request
 * Returns result in the form of JSON {success, msg}
 *  */
router.post('/issues/create', function (req, res, next) {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();

  var component = new Issues(
    {
      name: req.body.name,
      email: req.body.email,
      status: "Requested",
      //date_of_issue: "2020-05-22",
      date_of_issue:  yyyy + '-' + mm + '-' + dd, // Automatically set the date when issue is made
      items: req.body.items // This should be in the form of HashMap
    }
  );
  component.save(function (err) {
    if (err) {
      console.log(err);
      res.json({ success: 0, msg: (err.toString())});
    }
    res.json( { success: 1, msg: "success"} );
  });
});

/**
 * API To view all the pending issues which are made by the user
 * Response: {success, msg}
 */
router.post('/issues/myissues', function(req, res, next) {
  var email = req.body.email;
  console.log(email);
  Issues.find({ email: email}).exec(function (err, result) {
    if (err) {
      //console.log(err);
      res.json({ success: 0, msg: (err.toString())});
    }
    //console.log(result);
    res.json({success: 1, msg: result});
  });
});

// -------- Admin Issue controls -----------
/**
 * API To view all the current issues which are made
 * Response: {success, msg}
 */
router.get('/issues/all', function(req, res, next) {
  Issues.find({}).exec(function (err, result) {
    if (err) {
      console.log(err);
      res.json({ success: 0, msg: (err.toString())});
    }
    console.log(result);
    res.json({success: 1, msg: result});
  });
});

// API to accept the return request
router.post('/issues/:id/return', function (req, res, next) {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();

  var component = new Issues(
    {
      status: "Returned",
      date_of_return: yyyy + '-' + mm + '-' + dd, // Automatically set the date when issue is made,
      _id: req.params.id
    }
  );
  Issues.findByIdAndUpdate(req.params.id, component, {}, function (err, thecomponent) {
    if (err) { return next(err); }
    res.json({success: 1, msg: "returned"});
  });
});


/**
 * API To cancel an item request (Very Important) Cancel by the user
 * Response: {success, msg}
 */
router.post('/issues/:id/delete', function (req, res, next) {
  Issues.findByIdAndRemove(req.params.id, function deleteComponent(err) {
    if (err) {
      console.log(err);
      res.json({ success: 0, msg: (err.toString())});
    }
    // Success - Return
    res.json({ success: 1, msg: "Removed" });
  });
});


module.exports = router;

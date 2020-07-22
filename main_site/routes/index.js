var express = require('express');
var router = express.Router();
var Inventory = require('../models/inventory');
var News = require('../models/news');
var Projects = require('../models/projects');
var Issues = require('../models/issues');

var nodeMailer = require('nodemailer');
var config = require('config');

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
  
  var correctUn = config.get('adminUsername');
  var correctPasswd = config.get('adminPassword');
  // Now check condition
  if(un===correctUn && passwd===correctPasswd){
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
  // console.log(component.date_created);
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

/* For mailing one done by Rohan */
router.post('/sendemail', function(req, res){
  var message = "";

  var mailEmail = config.get('mailFromEmail');
  var mailPassword = config.get('mailFromPassword');
  var mailToEmail = config.get('mailToEmail');

  let mailer = nodeMailer.createTransport({
      host:'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
          user: mailEmail, // Email of the website from which id to send mail
          pass: mailPassword
      }
  });
  let mailOptions = {
    from: '"Robotronics" <robotronics@students.iitmandi.ac.in>',
    to: req.body.email, 
    subject: "Message Recieved",
    html: 'Your Message have been recieved.<br>Regards<br><b>Robotronivs Club,</b><br><b>IIT Mandi</b>'
  };
  let mailOptions1 = { // This is the section where email to send details go.
    from: '"Robotronics" <robotronics@students.iitmandi.ac.in>',
    to: mailToEmail,
    subject: "You have got an message", 
    html: `<b>From:</b> ${req.body.email}<br> <b>Name:</b> ${req.body.name}<br> <b>Subject:</b> ${req.body.subject}<br> <b>Message:</b> ${req.body.message}`
    
  };

  mailer.sendMail(mailOptions, (error, info) => {
      if (error) {
          message = "NotOK"
          console.log(error);
          return res.send(message);
      }
      console.log('Message %s sent: %s', info.messageId, info.response);
      message = "OK"
    });

  mailer.sendMail(mailOptions1, (err, info)=>{
    if(err){
      nessage = "NotOK"
      console.log(err)
      return res.send(message)
    }
    console.log('Message %s sent: %s', info.messageId, info.response)
    message = "OK"
    res.send(message)
  });
  
});

/* REST APIs to handle Issues done by Priyam */
// status: "Requested" - create ,"Return-Pending" - accept, "Returned" - clear
/* Example
  {
    "items": { "motors": "2", "ir sensor": "3" },
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
/issues/:id/accept // Accepting the issue - sets the status to "Return-Pending"
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

  console.log(req.body);

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
  Inventory.updateOne({name:"motor"},{available:10},function(err,result){
    if(err){
      res.send(err);
    }
    else{
      res.send(result);
    }
  });
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
 * isLoggedIn ensures that admin is working
 */
router.post('/issues/all', isLoggedIn, function(req, res, next) {
  Issues.find({}).sort({date_of_issue: 'descending'}).exec(function (err, result) {
    if (err) {
      console.log(err);
      res.json({ success: 0, msg: (err.toString())});
    }
    //console.log(result);
    res.json({success: 1, msg: result});
  });
});

// API to accept the return request
router.post('/issues/:id/accept', isLoggedIn, function (req, res, next) {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();

  // use new issues if you need to fully create it a new one
  var component = {
      status: "Return-Pending",
      date_of_issue: yyyy + '-' + mm + '-' + dd, // Automatically set the date when issue is made,
      _id: req.params.id
    };

  Issues.findByIdAndUpdate(req.params.id, component, {}, function (err, thecomponent) {
    if (err) { return next(err); }
    res.json({success: 1, msg: "Return-Pending"});
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

// API just for checking if the server is working or not
router.post('/issues/check', function (req, res, next) {
  console.log(req.body);
  res.json({ success:1 , msg: "check" });
});

/**
 * API To update any component issue
 * Request: _id in params, item : { "motors": "3", "nodemcu": "2" } (Example)
 * Response: {success, msg}
 */
router.post('/issues/:id/update', function(req, res, next) {
  
  // console.log(req.body);

  var component = new Issues(
    {
      items: req.body.items,
      _id: req.params.id
    }
  );
  // console.log(component);
  
  Issues.findByIdAndUpdate(req.params.id, component, {}, function (err, thecomponent) {
    if (err) { res.json({ "success": 0, msg: (err.toString()) }) }
    res.json({ "success": 1, msg: "updated"});
  });
});

module.exports = router;

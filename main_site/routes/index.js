var express = require('express');
var router = express.Router();
var Inventory = require('../models/inventory');
var News = require('../models/news');
var Projects = require('../models/projects');
var nodeMailer = require('nodemailer')

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

router.post('/sendemail', function(req, res){
  var message = ""
  let mailer = nodeMailer.createTransport({
      host:'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
          user: 'roboticsiitmandi123@gmail.com', // Test Email
          pass: 'robotics@123'
      }
  });
  let mailOptions = {
    from: '"Robotronics" <roboticsiitmandi@gmail.com>',
    to: req.body.email, 
    subject: "Message Recieved",
    html: 'Your Message have been recieved.<br>Regards<br><b>Robotronivs Club,</b><br><b>IIT Mandi</b>'
  };
  let mailOptions1 = { // This is the section where email to send details go.
    from: '"Robotronics" <roboticsiitmandi@gmail.com>',
    to: "rrk15012002@gmail.com", 
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
      res.send(message)
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
  })
  
})
module.exports = router;

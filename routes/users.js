//USER routes
var express   = require("express"),
    router    = express.Router(),
    User      = require("../models/user"),
    passport  = require("passport"); 



//GET the user signup form 
router.get("/signup", function (req, res) {
  res.render("signup");
});

//POST a signup and log the user in
router.post("/signup", function (req, res) {
  var newUser= new User({username: req.body.username});
  User.register(newUser, req.body.password, function (err, newUser) {
      if (err) {
        console.log(err);
      } 
      else {
          passport.authenticate("local")(req, res, function () {
            res.redirect("/blogs");       
      });
    }
  });
});

//GET the login form
router.get("/login", function (req, res) {
  res.render("login");
});

//POST login
router.post("/login", passport.authenticate("local", {

  successRedirect: "/blogs",
  failureRedirect:"/login"


}));

//logout user
router.get("/logout", function (req, res) {
  req.logout();
  res.redirect('/blogs');
});


module.exports= router;

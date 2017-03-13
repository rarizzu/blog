var express         = require("express"),
app                 = express(),
bodyParser          = require("body-parser"),
mongoose            = require("mongoose"),
methodOverride      = require("method-override"),
passport            = require("passport"),
LocalStrategy       = require("passport-local"),
User                = require("./models/user"),
Blog                = require("./models/blog"),
Comment             = require("./models/comment"),
middleware          = require("./middleware"),
blogRoutes          = require("./routes/blogs"),
userRoutes          = require("./routes/users"),
commentRoutes       = require("./routes/comments"),
sass                = require("node-sass");



mongoose.connect('mongodb://localhost/blogApp');


app.use(bodyParser.urlencoded({extended :true}));
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.set("view engine", "ejs");

//passport setup==========================
//express session makes a "user session" so the users activity can be stored while they are logged in
app.use(require("express-session")({//express-session needs to be used before the middleware passport call beneath it
  secret:"make lilo live forever",
  resave: false,
  saveUninitialized: false
}));  

//these are middleware calls that can be used throughout the project
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); //authenticates the user after the login.  this is middleware
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
//=========================================

//set currenUser middleware================
app.use( function (req, res, next) {
  res.locals.currentUser= req.user;
  next();
});
//=========================================

app.use("/blogs" , blogRoutes);  //when you use routes, you must specify a baseline route path.  /blogs is the start of all blog routes that we hasd
app.use("/" , userRoutes);
app.use("/blogs/:id/comments", commentRoutes);  






//=================================
//server start

app.listen(3000, function () {
  console.log('blog app has started')
})
//blog routes
var express   = require("express"),
    router    = express.Router(),
    Blog      = require("../models/blog"),
    middleware= require("../middleware");
    




//GET the home page 

//redirect from / to the home page then find & show all blogs in the db
router.get("/", function (req, res) {
  Blog.find({}, function (err, foundBlog) {
    if (err) {
        console.log (err);
    }
      else {
            res.render("blogs", {blogs:foundBlog});         
      }
    });
  });

//GET the new page
router.get("/new", middleware.isLoggedIn,function (req, res) {
  res.render("new");
});

//POST a new blog to db
router.post("/", middleware.isLoggedIn, function (req, res) {
  var title         = req.body.title,
        description   = req.body.description,
        text          = req.body.text,
        image         = req.body.image,
        created       = req.body.created,
        author        = {
            id: req.user._id,
            username: req.user.username 
      
      };

      var newBlog = {title:title, description:description , text:text , image:image, created:created, author:author};
          Blog.create(newBlog, function (err, newBlog) {
              if (err) {
                  throw err;
              }
              else {
                  res.redirect("/blogs");               
                  }
            });
          });
          

//GET the new page

router.get("/new", function (req, res) {
      res.render("show");
});

//SHOW post page
router.get("/:id", function ( req, res) {
    Blog.findById(req.params.id).populate("comments").exec(function (err, foundBlog) {
      if (err) {
        console.log(err);
      }
      else {
        
        res.render("show", {blog:foundBlog});
      }
  });
});

//SHOW edit page
router.get("/:id/edit", function (req, res) {
  Blog.findById(req.params.id, function (err, foundBlog) {
    if (err) {
      console.log(err);
    }

    else {
      res.render("edit", {blog: foundBlog});
    }
  });
}); 

//PUT route to edit the post
router.put("/:id",middleware.isBlogOwner ,function (req, res) {
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, function (err, updatedBlog){
      if (err) {
        console.log(err)
      }

      else {
        res.redirect("/blogs/"+updatedBlog._id);
      }
  });
});

//DELETE post route
router.delete("/:id", middleware.isBlogOwner ,function (req, res) {
  Blog.findByIdAndRemove(req.params.id, function (err, deletedCampground) {
    if (err) {
      console.log(err);
    }   
    else {
      res.redirect("/blogs");
      }  
  });
});


module.exports= router;
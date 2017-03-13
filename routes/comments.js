//comment routes
var express   = require("express"),
    router    = express.Router({mergeParams: true}),
    Blog      = require("../models/blog"),
    Comment   = require("../models/comment"),
    middleware= require("../middleware");


//POST new comment
router.post("/",middleware.isLoggedIn ,function (req, res) {
    Blog.findById(req.params.id, function (err, blog) {
        if (err) {
            throw err;
        }       
        else {  
            var comment= {   
                    text: req.body.text,
                    author: {
                        id: req.user._id,
                        username: req.user.username
                    }
                };
                    Comment.create(comment, function (err, newComment) {
                        if (err) {
                            throw err;
                        }
                        else {          
                                          
                            blog.comments.push(newComment); //send the comment to the comment array on the blog model 
                            blog.save(); //need to save the blog after you make any changes to it                   
                            res.redirect("/blogs/"+blog._id);
                 }
            });
        }
    });
});


//GET new comment page
router.get("/new", function (req, res) {
    Blog.findById(req.params.id, function (err, foundBlog) {
        if (err) {
            throw err;
        }

        else {

            res.render("newComment", {blog:foundBlog});
        }  
    });
});


// GET comment edit page
router.get("/:comment_id/edit", function (req, res) {
    Blog.findById(req.params.id, function (err, foundBlog) {
        if (err) {
            throw err;
        }

        else {
            Comment.findById(req.params.comment_id, function (err, foundComment) {
                if (err) {
                    throw err;
                }

                else     {
                    res.render("editComment", {blog:foundBlog, comment:foundComment});            
                }
            });
        }
    });   
});


//PUT comment edit
router.put("/:comment_id", middleware.isCommentOwner,function (req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (err, updatedComment) {
        if (err) {
            throw err;
        }
        else {
          
                res.redirect("/blogs/"+req.params.id);
                console.log(req.body.comment);
        } 
        
    });
});

//DELETE comment   
router.delete("/:comment_id", function (req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(err) {
        if (err) {
            throw err;
        }
        else {
            Blog.findById(req.params.id, function (err, foundBlog) {            
                res.redirect("/blogs/" +foundBlog._id);
            });           
        }
    });
});



module.exports= router;
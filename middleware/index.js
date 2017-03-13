var middlewareObj ={};
var Blog= require("../models/blog");
var Comment= require("../models/comment");

middlewareObj.isLoggedIn= function (req, res, next) {
    if (req.isAuthenticated()){ //where does isAuthenticated come from??
        return next();
    }
    else {
        res.redirect("/login");
    }
};

middlewareObj.isCommentOwner= function (req, res, next) {
    Comment.findById(req.params.comment_id, function (err, foundComment) {
        if (req.user._id.equals(foundComment.author.id)) {
            return next();
        }
        else {
            res.redirect("/blogs");
        }

    });
};

middlewareObj.isBlogOwner = function (req, res, next) {
    Blog.findById(req.params.id, function (err, foundBlog) {
        if (err) {
            throw err;
        }
        else {
            if (req.user._id.equals(foundBlog.author.id)) {
                return next();
            }
            else {
                res.redirect("/blogs/"+foundBlog._id);
            }
        }
    });
};




    

module.exports=middlewareObj;

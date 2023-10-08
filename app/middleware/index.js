//all Middleware

var product = require("../models/product");
var Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.checkproductOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		product.findById(req.params.id, function(err, foundproduct){
		if(err){
			req.flash("error", "Something went wrong, please try again")
			res.redirect("back");
		} else {
			if(foundproduct.author.id.equals(req.user._id)){
			next();
		} else {
			req.flash("error", "You don't have permission to do that");
			res.redirect("back");
		}
		}
	});
	}	else {
			req.flash("error", "Please log in to do that");
			res.redirect("back");
	}	
}	

middlewareObj.checkCommentOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err){
			res.redirect("back");
		} else {
			if(foundComment.author.id.equals(req.user._id)){
			next();
		} else {
			req.flash("error", "You don't have permission to do that");
			res.redirect("back");
 			}
           }
        });
    } else {
		req.flash("error", "Please log in to do that");
        res.redirect("back");
    }
}

//Middleware is logged in

middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "Please log in or Sign Up");
	res.redirect("/login");
}



module.exports = middlewareObj;
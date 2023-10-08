var express = require("express");
var router  = express.Router({mergeParams: true});
var product = require("../models/product");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//Comments New 

router.get("/new", middleware.isLoggedIn, function(req, res){
	product.findById(req.params.id, function(err, product){
		if(err){
			console.log(err);
		} else {
			res.render("comments/new", {product: product});
		}
	})
});

//Comments create

router.post("/", middleware.isLoggedIn, function(req, res){
	product.findById(req.params.id, function(err, product){
	if(err){
		console.log(err);
		res.redirect("/products");
	} else {
	Comment.create(req.body.comment, function(err, comment){
		if(err){
			console.log(err);
		} else {
				comment.author.id = req.user._id;
				comment.author.username = req.user.username;
			
			//save comment
				comment.save();
				product.comments.push(comment);
				product.save();
				req.flash("success", "You don't have permission to do that");
				res.redirect('/products/' + product._id);
			}
			});
		}
	});
});

//comment edit
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req,res){
	Comment.findById(req.params.comment_id, function(err, foundComment){
	if(err){
		res.redirect("back");
	} else {
		res.render("comments/edit", {product_id: req.params.id, comment: foundComment});
	}
	});
});

//comment update
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if(err){
			res.redirect("back");
		} else{
			res.redirect("/products/" + req.params.id);
		}
	});
});

//comment destroy
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
  Comment.findByIdAndRemove(req.params.comment_id, function(err){
	  if(err){
		  res.redirect("back");
	  } else {
		  req.flash("success", "Your comment has been deleted");
		  res.redirect("/products/" + req.params.id);
	  }
  });	
});

	

module.exports = router;
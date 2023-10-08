var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Analytics = require('analytics-node');
var analytics = new Analytics('0FiyK6qY4D8oqPcjhL8d0Ww2TEYLEy26');

//Root route

router.get('/', function(req, res){
	res.render("landing");
});



//register
router.get("/register", function(req, res){
	res.render("register");
});

router.post("/register", function(req, res){
	
	analytics.identify({
  		userId: req.body.username,
  		traits: {
    		email: req.body.email
  		}
	});
	
	analytics.track({
  		userId: req.body.username,
  		event: 'account created',
  		properties: {
    		revenue: 39.95,
    		plan_type: 'basic_user'
  			}
	});	
	
	
	var newUser= new User({username: req.body.username});	
	User.register(newUser, req.body.password, function(err, user){
		if(err){
   			 console.log(err);
   		return res.render("register", {error: err.message});
		}
		passport.authenticate("local")(req, res, function(){
			req.flash("success", "Welcome to Holistic Escapes " + user.username)
			res.redirect("/products");
		});
	});
});


//Login form

router.get("/login", function(req, res){
	res.render("login");
});


//handle loging logic

router.post("/login", passport.authenticate("local",
	{
		successRedirect: "/products",
		failureRedirect: "/login"
	}), function(req, res){
		 
});

//Logout route

router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "Logged Out Successfully");
	res.redirect("/products");
});



module.exports = router;
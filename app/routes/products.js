var express        = require("express");
var router         = express.Router();
var product     = require("../models/product");
var middleware     = require("../middleware");


// INDEX - show all products
router.get("/", function (req, res) {
		
    var perPage = 8;
    var pageQuery = parseInt(req.query.page);
    var pageNumber = pageQuery ? pageQuery : 1;
    product.find({}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function (err, allproducts) {
        product.count().exec(function (err, count) {
            if (err) {
                console.log(err);
            } else {
                res.render("products/Index", {
                    products: allproducts,
                    current: pageNumber,
                    pages: Math.ceil(count / perPage)
                });
            }
        });
    });
});


//Create product route

router.post("/", middleware.isLoggedIn, function(req,res){
	var name = req.body.name;
	var image = req.body.image;
	var cost = req.body.cost;
	var shdescription = req.body.shdescription;
	var longdescription = req.body.longdescription;
	var price = req.body.price;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newproduct = {name: name, image: image, cost: cost, shdescription: shdescription, longdescription: longdescription, author: author}
	product.create(newproduct, function(err, newlyCreated){
		if(err){
			console.log(err);
		} else {
				res.redirect("/products");
		}
	});
});

//New -shows form for products
router.get("/new", middleware.isLoggedIn, function(req,res){
	res.render("products/new");
});

//Show
router.get("/:id", function(req, res){	product.findById(req.params.id).populate("comments").exec(function(err, foundproduct){
		if(err){
			console.log(err);
		} else {	
		res.render("products/show", {product: foundproduct});
		}
	});
});


//Edit product route
router.get("/:id/edit", middleware.checkproductOwnership, function(req, res){
	if(req.isAuthenticated()){
		product.findById(req.params.id, function(err, foundproduct){
		if(err){
			res.redirect("/products")
	} else {
		if(foundproduct.author.id.equals(req.user._id)) {
			res.render("products/edit", {product: foundproduct});
			} else {
				res.send("You need to be logged in");
		}
	}
});
}
});	


//Update product route
router.put("/:id", middleware.checkproductOwnership, function(req, res){
	product.findByIdAndUpdate(req.params.id, req.body.product, function(err, updatedproduct){
		if(err){
			
			res.redirect("/products");
		} else{
			res.redirect("/products/" + req.params.id);
		}
	});
});

//Destroy product route
router.delete("/:id", middleware.checkproductOwnership, function(req, res){
	product.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/products");
		} else {
			req.flash("success", "Your product entry has been deleted");
			res.redirect("/products");
		}	
	});
});



module.exports = router;
var mongoose     = require("mongoose");
var product   = require("./models/product");
var Comment      = require("./models/comment");

var data = [
			{
				name: "Skyway Hills",
				image: "https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
				description: "Such a beautifu sky at Skyway."
			},
			{
				name: "Golden Lake",
				image: "https://images.unsplash.com/photo-1484960055659-a39d25adcb3c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
				description: "Such a beautiful Golden Lake."
		    },
			{
				name: "Dark Canyon Forest",
				image: "https://images.unsplash.com/photo-1475483768296-6163e08872a1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
				description: "Such a beautiful dark canyon and forest."
		}
	
]

function seedDB(){
	product.remove({}, function(err){
		 if(err){
			  console.log(err);
		}
		console.log("removed products!");
		
		data.forEach(function(seed){
			product.create(seed, function(err, product){
				if(err){
					console.log(err);
				} else {
				console.log("added a product");
					
					//create comment
					Comment.create(
					{
						text:"This place is great!",
						author:"Homer BadBallz"
					}, function(err, comment){
						if(err){
							console.log(err);
						} else {
							product.comments.push(comment);
							product.save();
							console.log("created new comments");
						}
					});
				}
			});
		});
	});
}	

module.exports = seedDB;
	

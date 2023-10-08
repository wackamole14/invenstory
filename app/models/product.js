var mongoose    = require("mongoose");


var productschema = new mongoose.Schema({
	name: String,
	image: String,
	price: String,
	longdescription: String,
	shdescription: String,
	cost: Number,	
	author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   },
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	]
});


module.exports = mongoose.model("product", productschema);
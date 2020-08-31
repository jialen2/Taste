var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var TasteSchema = new mongoose.Schema({
	name: String,
	address: String,
	rate: Number,
	rateNumber: Number,
	// telephone: String,
	price: Number,
	image: String,
	telephone: String,
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
   // comments: [
   //    {
   //       type: mongoose.Schema.Types.ObjectId,
   //       ref: "Comment"
   //    }
   // ],
   dishes: [Object]
});
TasteSchema.plugin(passportLocalMongoose)
module.exports = mongoose.model("Taste", TasteSchema);
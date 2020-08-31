var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var dishSchema = new mongoose.Schema({
	name: String,
	price: Number,
	image: String
})
dishSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("dish", dishSchema);
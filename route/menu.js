var express = require("express");
var router  = express.Router();
var Taste = require("../models/taste");
var Dish = require("../models/dish");
var middleware = require("../middleware");

router.get("/taste/:id/menu", (req, res) => {
  Taste.findById(req.params.id, (err, foundTaste) => {
  	// foundTaste.dishes = [];
  	// foundTaste.save();
  	console.log(foundTaste.dishes);
    if (err) {
      console.log(err);
    } else {
      res.render("menu/menu", {taste: foundTaste});
    }
  })
})

router.get("/taste/:id/menu/new", (req, res) => {
	res.render("menu/new", {id: req.params.id});
})

router.post("/taste/:id/menu", (req, res) => {
	var dish = {name: req.body.name, image: req.body.image, price: req.body.price};
	Taste.findById(req.params.id, (err, foundTaste) => {
		if (err) {
			console.log(err);
		} else {
			Dish.create(dish, (err, newlyCreated) => {
				if (err) {
					console.log(err);
				} else {
					foundTaste.dishes.push(newlyCreated);
					foundTaste.save();
					req.flash('success', 'Successfully Added');
					res.redirect("/taste/" + req.params.id + "/menu")
				}
			})
		}
	})
})
module.exports = router;
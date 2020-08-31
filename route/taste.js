var express = require("express");
var router  = express.Router();
var Taste = require("../models/taste");
var middleware = require("../middleware");
// var request = require("request");

router.get("/taste", (req,res) => {
    if (req.user) {
        console.log(req.user._id);
    }
    Taste.find({}, (err, allTaste) => {
        if (err) {
            console.log(err);
        } else {
            res.render("taste/taste", {tastes: allTaste});
        }
    })
})

router.post("/taste", middleware.isLoggedIn, (req, res) => {
    var name = req.body.name;
    var address = req.body.address;
    var image = req.body.image;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newTaste = {name: name, address: address, rate: -1, rateNumber : 0, price: -1, image: image, telephone: req.body.telephone, author: author}
    Taste.create(newTaste, function(err, newlyCreated){
        if(err){
            console.log(err);
            res.redirect("/taste");
        } else {
            res.redirect("/taste");
        }
    });
})

router.get("/taste/new", middleware.isLoggedIn, (req, res) => {
    res.render("taste/new");
});

router.get("/taste/:id", function(req, res){
    Taste.findById(req.params.id, (err, foundTaste) => {
        if(err){
            console.log(err);
        } else {
            res.render("taste/show", {taste: foundTaste});
        }
    });
});

router.get("/taste/:id/edit", middleware.checkUserTaste, function(req, res){
    Taste.findById(req.params.id, function(err, foundTaste){
        if(err){
            console.log(err);
        } else {
            res.render("taste/edit", {taste: foundTaste});
        }
    });
});

router.put("/taste/:id", middleware.checkUserTaste, function(req, res){
    Taste.findById(req.params.id, function(err, foundTaste){
        if(err){
            req.flash("error", err.message);
        } else {
            foundTaste.name = req.body.name;
            foundTaste.address = req.body.address;
            foundTaste.image = req.body.image;
            foundTaste.save((err) => {
                if (err) {
                    console.log(err);
                } else {
                    req.flash("success","Successfully Updated!");
                }
            })
        }
        res.redirect("/taste/" + foundTaste._id);
    });
});

router.delete("/taste/:id", middleware.checkUserTaste, function(req, res){
    console.log("been");
    Taste.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log("err");
        } else {
            res.redirect("/taste");
        }
    })
});

module.exports = router;

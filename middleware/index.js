var Comment = require("../models/comment");
var Taste = require("../models/taste");
module.exports = {
    isLoggedIn: function(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash("error", "You must be signed in to do that!");
        res.redirect("back");
    },
    checkUserTaste: function(req, res, next){
        if(req.isAuthenticated()){
            Taste.findById(req.params.id, function(err, foundTaste){
               if(foundTaste.author.id.equals(req.user._id)){
                   console.log("success");
                   next();
               } else {
                   req.flash("error", "You don't have permission to do that!");
                   res.redirect("/taste/" + req.params.id);
               }
            });
        } else {
            req.flash("error", "You need to be signed in to do that!");
            res.redirect("/login");
        }
    },
    checkUserComment: function(req, res, next){
        console.log("YOU MADE IT!");
        if(req.isAuthenticated()){
            Comment.findById(req.params.commentId, function(err, comment){
               if(comment.author.id.equals(req.user._id)){
                   next();
               } else {
                   req.flash("error", "You don't have permission to do that!");
                   res.redirect("/taste/" + req.params.id);
               }
            });
        } else {
            req.flash("error", "You need to be signed in to do that!");
            res.redirect("login");
        }
    }
}
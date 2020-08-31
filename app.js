var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    flash       = require("connect-flash"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    cookieParser = require("cookie-parser"),
    session = require("express-session"),
    seedDB      = require("./seeds"),
    passportLocalMongoose = require("passport-local-mongoose"),
    methodOverride = require("method-override"),
    bcrypt = require("bcrypt"),
    SALT_WORK_FACTOR = 10,
    middleware = require("./middleware/");

var User = require("./models/user");
var Taste = require("./models/taste");


var tasteRoute = require("./route/taste");
var menuRoute = require("./route/menu");

// seedDB();

mongoose.connect("mongodb://localhost/imovie");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride('_method'));
app.use(cookieParser('secret'));

app.use(flash());

// user authentication
app.use(require("express-session")({
    secret: "First web project",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You must be signed in to do that!");
    res.redirect("/login");
}
//

// flash
app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.success = req.flash('success');
   res.locals.error = req.flash('error');
   next();
});
//

app.get("/", function(req, res) {
  if (req.user) {
    console.log(req.user.username);
  }
	res.render("landing");
})

app.get("/register", function(req, res){
   res.render("register"); 
});
app.get("/login", function(req, res){
   res.render("login"); 
});
app.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            req.flash("error", err.message);
            return res.redirect("register");
        }
        passport.authenticate("local")(req, res, function(){
           req.flash("success", "Successfully Signed Up! Nice to meet you " + req.body.username);
           res.redirect("/taste"); 
        });
    });
});

app.post("/login", passport.authenticate("local", 
    {
        failureFlash: true,
        successFlash: 'Welcome!',
        successRedirect: "/taste",
        failureRedirect: "/login"
    }), function(req, res){
});
app.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "LOGGED YOU OUT!");
   res.redirect("/taste");
});
app.get("/verifyP", middleware.isLoggedIn, (req, res) => {
	res.render("verifyP");
})
app.get("/verifyU", middleware.isLoggedIn, (req, res) => {
	res.render("verifyU");
})
app.post("/verifyP", middleware.isLoggedIn, (req, res) => {
    User.findOne({ username: req.user.username }, function (err, user) {
      if (err) {
      	console.log(err);
      	return res.redirect("/taste");
      }
      if (!user) {
      	return res.redirect("/taste");
      }
      // if (!user.validPassword(req.body.confirm)) {
      // 	req.flash("error", "password incorrect");
      // 	return res.redirect("/verifyP");
      // }
      // bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
      //     if (err) console.log(err);
      //     console.log("salt" + salt);

      //     // hash the password using our new salt
      //     bcrypt.hash(user.password, salt, function(err, hash) {
      //         if (err) console.log("hash" + err);

      //         // override the cleartext password with the hashed one
      //         user.password = hash;
      //     });
      // });
      console.log(req.body.confirm);
      console.log(user.username);
      // bcrypt.compare(req.body.password, user.password, function(err, result) {
      //     if(err) {
      //         console.log('Comparison error: ', err);
      //     }
      //     if (result) {
      //       return res.redirect("/");
      //     } else {
      //       return res.redirect("/verifyP");
      //     }
      // })
      // user.comparePassword(req.body.confirm, function(err, isMatch) {
      //     if (err) throw err;
      //     if (isMatch) {
      //       return res.redirect("/");
      //     } else {
      //       return res.redirect("/verifyP");
      //     }
      // });
      return res.redirect("/changeP");
    });
});

app.post("/verifyU", middleware.isLoggedIn, (req, res) => {
    User.findOne({ username: req.user.username }, function (err, user) {
      if (err) {
      	console.log(err);
      	return res.redirect("/taste");
      }
      if (!user) {
      	return res.redirect("/taste");
      }
      if (!user.validPassword(req.body.confirm)) {
      	req.flash("error", "password incorrect");
      	return res.redirect("/verifyU");
      }
      return res.redirect("/changeU");
    });
});
app.get("/changeP", middleware.isLoggedIn, (req, res) => {
	res.render("changeP");
});
app.get("/changeU", middleware.isLoggedIn, (req, res) => {
	res.render("changeU");
});
app.post("/changeP", middleware.isLoggedIn, (req, res) => {

})
app.post("/changeU", middleware.isLoggedIn, (req, res) => {
  User.update({username: req.user.username}, {$set})
})
app.post("/changeU", middleware.isLoggedIn, (req, res) => {
  var query = {"username": req.body.username};
  User.update({username: req.user.username}, {$set: query});
  res.redirect("/");
});

app.post("/rate", middleware.isLoggedIn, (req, res) => {
  var rate = -1;
  var currentRate = 0;
  if (req.body.rating === "5") {
    currentRate = 5;
  } else if (req.body.rating === "4 and a half") {
    currentRate = 4.5;
  } else if (req.body.rating === "4") {
    currentRate = 4;
  } else if (req.body.rating === "3 and a half") {
    currentRate = 3.5;
  } else if (req.body.rating === "3") {
    currentRate = 3;
  } else if (req.body.rating === "2 and a half") {
    currentRate = 2.5;
  } else if (req.body.rating === "2") {
    currentRate = 2;
  } else if (req.body.rating === "1 and a half") {
    currentRate = 1.5;
  } else if (req.body.rating === "1") {
    currentRate = 1;
  } else if (req.body.rating === "half") {
    currentRate = 0.5;
  }

  Taste.findById(req.body.id, (err, foundTaste) => {
    if (foundTaste.rate != -1) {
      rate = (foundTaste.rate * foundTaste.rateNumber + currentRate) / (foundTaste.rateNumber + 1);
    } else {
      rate = currentRate;
    }
    foundTaste.rate = rate;
    foundTaste.save((err) => {
      if (err) {
        console.log(err);
      }
    });
  })
  Taste.findByIdAndUpdate(req.body.id, {$inc: {"rateNumber": 1}}, (err, foundTaste) => {
    if (err) {
      console.log(err);
    }
  });
  res.redirect("/taste");
})


app.use("", tasteRoute);
app.use("", menuRoute);
app.listen(3000);
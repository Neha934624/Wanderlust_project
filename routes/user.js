let express=require("express")
let router=express.Router();

let usermodel=require("../models/user");
const passport = require("passport");
const { saveRedirUrl } = require("../middleware");

const userController=require("../controller/user")

router.get("/signup",userController.renderSignUpForm)
// whenever it is signed up it should automatically loggedin
router.post("/signup",userController.signUp)

// router.route==>in order to make our code more compact way  we can write common route in route and remove from other
router.route("/login")
 .get(userController.renderLoginForm)
 .post(passport.authenticate('local', {
       failureRedirect: '/login' ,
       flashFailure:true,
       failureFlash:true
      }),async(req,res)=>{
      req.flash("sucess","Welcome back to wanderlust")
      res.redirect("/listings")
  })
// !Route to handle login
router.post("/login", saveRedirUrl, (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) return next(err); // Handle error
        if (!user) {
            req.flash("error", "Invalid username or password");
            return res.redirect("/login");
        }
      // If authentication is successful, log in the user
        req.logIn(user, (err) => {
            if (err) return next(err);
            userController.logIn(req, res); // Call your login controller method
        });
    })(req, res, next); // Don't forget to invoke passport.authenticate with (req, res, next)
});
router.get("/logout",userController.logOutUser)
module.exports=router


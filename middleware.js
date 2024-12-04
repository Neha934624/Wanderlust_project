const Listening = require("./models/listening");
const { findById } = require("./models/reviews");
const Review=require("./models/reviews")

module.exports.verifyLogin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl=req.originalUrl;
        req.flash("error", "You must be logged in!");
        return res.redirect("/login");
    }
    next();
};
module.exports.saveRedirUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl
    }
    next()
}
module.exports.isOwner =async (req, res, next) => {
    if (!res.locals.currusr) {
      // If `currusr` is not defined, the user is not logged in
      req.flash("error", "You need to be logged in to do that.");
      return res.redirect("/login");  // Redirect to login if not authenticated
    }
  //  const listing = req.listing;  // Assuming you're passing the listing object via middleware
    let {id}=req.params;
    let listing=await Listening.findById(id)
    // Ensure the listing has an owner and the user is the owner
    if (!listing.owner.equals(res.locals.currusr._id)) {
      req.flash("error", "You are not authorized to edit this listing.");
      return res.redirect(`/listings/${id}`);
    }
    next();  // Proceed to the next middleware or route handler
};

module.exports.isAuthor=async (req,res,next)=>{
    let {id,reviewId}=req.params;
    let reviews=await Review.findById(reviewId)
    if(! reviews.author.equals(res.locals.currusr._id)){
        req.flash("error","You are not the author of this review")
        return res.redirect(`/listings/${id}`)
    }
    next();
}
const validateSchema = (req, res, next) => {
    const { error } = listingSchema.validate({ Listings: req.body }); // Adjusted validation to expect { Listings: req.body }
    if (error) {
        return next(new expErr(400, "Invalid input: " + error.details[0].message));
    }
    next();
};

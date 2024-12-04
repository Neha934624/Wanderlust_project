const Revie=require("../models/reviews")
const Listening=require("../models/listening")

module.exports.postReview=async(req,res)=>{
    let lists=await Listening.findById(req.params.id)
    let newReview=new Revie(req.body.review)
    newReview.author=req.user._id
    console.log(newReview)
    //reviews
    lists.reviews.push(newReview)
    await newReview.save()
    await lists.save();
    console.log("new review saved")
    req.flash("sucess","A new Review is added !") 
    res.redirect(`/listings/${lists._id}`)
}
module.exports.destroyReview=async(req,res)=>{
   let {id,reviewId}=req.params;
   await Listening.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
   await Revie.findByIdAndDelete(reviewId)
   req.flash("sucess","Review Deleted !")
   res.redirect(`/listings/${id}`)
}

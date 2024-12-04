const express=require("express")
const router=express.Router({mergeParams:true})
const wrapAsync=require("../utils/wrapAsync.js")
const expErr=require("../utils/expressError.js")

const {reviewSchema}=require("../schema.js")
let {verifyLogin , isAuthor}=require("../middleware.js")
//reviews
// !using controller
let reviewController=require("../controller/reviews.js")

const validateReview=(req,res,next)=>{
    let {err}=reviewSchema.validate(req.body)
    if(err){
        let errMsg=err.details.map((el)=>el.message).join(",")
        throw new expErr(400,errMsg);
    }
    else{
        next()
    }
}
// !REVIEWS--- /listings/<%=showList._id%>/reviews
// IT IS RECEIVED FROM SHOW.EJS   /listings/<%=showList._id%>/reviews
router.post("/",verifyLogin,reviewController.postReview)
 // !DELETE REVIEW
 //"/listings/<%=showList._id%>/review/<%=rev._id%>
 router.delete("/:reviewId",isAuthor,verifyLogin ,reviewController.destroyReview)

module.exports=router
const express=require("express")
const router=express.Router();
const expErr=require("../utils/expressError.js")
const {listingSchema}=require("../schema.js")
const { verifyLogin ,isOwner} = require("../middleware.js");
const {storage}=require("../cloudConfig.js")
//in order to get the data in the form of images,files... we use multer
const multer  = require('multer')
const upload = multer({ storage })
const listingController=require("../controller/listing.js")

// INDEX --as we have already mentioned in index.js  so instead of '/listings' we use '/' in all other operations 
router.get("/",listingController.index)

// TO ADD NEW LISTING //verifyLogin,
router.get("/new",verifyLogin,listingController.renderNewListing)

// SHOW ROUTEP
router.get("/:id",listingController.showListing)

// CREATE ROUTE  ,upload.single("listing[image]")
router.post("/",verifyLogin,
    upload.single('image'),
   (listingController.postNewForm));

// !EDIT ROUTE  /listings
router.get("/:id/edit",isOwner,verifyLogin,listingController.renderEditForm)

// !UPDATE ROUTE
router.put("/:id",isOwner,verifyLogin, upload.single('image'),listingController.updateListings)

// !DELETE ROUTE 
router.delete("/:id",isOwner,verifyLogin,listingController.destroyListing)

//we can also write as
//router.route("/:id").get("/:id",listingController.showListing)
//.put("/:id",isOwner,verifyLogin,listingController.updateListings)
//.delete("/:id",isOwner,verifyLogin,listingController.destroyListing)
module.exports=router;





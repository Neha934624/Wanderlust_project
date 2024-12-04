let Listening=require("../models/listening")
const expErr = require("../utils/expressError");

module.exports.index=async (req,res)=>{
    let allList=await Listening.find({});
    // console.log(allList);
    res.render("listing/index.ejs",{allList})
}

module.exports.renderNewListing=(req,res)=>{
    res.render("listing/add.ejs")
}

module.exports.showListing=async (req,res,next)=>{
    // if(!req.body.Listening){
    //     throw new expErr(400,"Please provide valid data")
    // }
        try{
            let {id}=req.params;
            let showList=await Listening.findById(id).populate({path:"reviews",populate:{path:"author"},}).populate("owner"); //reviews
            if(!showList){
              throw new expErr(404,"Listing not found");
            }
        res.render("listing/show.ejs",{showList})
        }catch(err){
            next(err)
        }
}
module.exports.postNewForm= async (req, res) => {
    try {
        let { title, description, price, location, country,categories } = req.body;
        if (!title || !description || !price) {
            req.flash('error_msg', "All fields are required. Please provide valid data."); // Specific error message
            return res.redirect("/listings/new"); // Redirect to the form
        }

        const newListing = new Listening({
            title,
            description,
            price,
            location,
            country,categories,
            image: {
                filename: req.file.filename,
                url: req.file.path || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQz0P7Hc-KEeZ2S6WC_INBHTHqmC83WAPBI5A&s",
            }
        });
        newListing.owner=req.user._id;
        // newListing.image={url,filename}
        await newListing.save();
        req.flash('success_msg', "New Listing Added");
        console.log("New listing created:", newListing);
        res.redirect("/listings");
    } catch (err) {
        req.flash('error_msg', "Failed to create the listing."); // Specific error message
        res.redirect("/listings/new"); // Redirect to the form
    }
}
module.exports.renderEditForm=async(req,res)=>{
    let {id}=req.params;
    let editList=await Listening.findById(id);
    if(!editList){
        req.flash("error","Listing you requested for does not exist!")
        res.redirect("/listings")
    }
    res.render("listing/edit.ejs",{editList})
}

module.exports.updateListings=async(req,res)=>{
    try{
      // Finding id
      let {id}=req.params;
      //Extracting values from body
      let { title, description, image, price, location, country } = req.body;
   
       // FINDING ID IN THAT LIST AND UPDATING THE VALUES
       let lists=await Listening.findByIdAndUpdate(id,{ title, description, image:{ filename: req.file.filename, url: req.file.path }, price, location, country })
       req.flash("sucess","Listing sucessfully updated")
       res.redirect("/listings")
    }
    catch(err){
     console.log("An error occured during updation",err)
     res.status(402).render("error.ejs",{err})
     // "Error occured during updation...Please try again"
    }
}
module.exports.destroyListing=async (req,res)=>{
    let {id}=req.params;
    let del=await Listening.findByIdAndDelete(id);
    console.log(del);
    req.flash("sucess","Mesaage deleted sucessfully!")
    res.redirect("/listings")
}
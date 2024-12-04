let Listening=require("../models/listening")
let usermodel=require("../models/user");
module.exports.renderSignUpForm=(req,res)=>{
    res.render("user/signup.ejs")
}
module.exports.signUp=async(req,res)=>{
    try{
        let {username,email,password}=req.body;
        let newUser=new usermodel({
          username:username,
          email:email,
        })
    let resp=await usermodel.register(newUser,password)
    req.login(resp,(err)=>{
        if(err){
            return next(err)
        }
        req.flash("sucess","Sucessfully signed up")
        res.redirect("/listings")  
    })
    console.log(resp)
    console.log(username,email,password)
    }catch(e){
        req.flash("error","Invalid please try again")
        res.redirect("/signup")
    }
    
}
module.exports.renderLoginForm=(req,res)=>{
    res.render("user/login.ejs")
    
}
module.exports.logIn = async (req, res) => {
    req.flash("sucess", "Welcome back to Wanderlust!");
    const redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};
module.exports.logOutUser=(req,res)=>{
    req.logout((err,next)=>{
        if(err){
            next(err)
        }
        req.flash("sucess","Logged out sucessfully !")
        res.redirect("/listings")

    })
}
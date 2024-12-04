if(process.env.NODE_ENV!= "production"){
    require('dotenv').config();
}
console.log(process.env.secret)
const express=require("express")
const app=express()
const ejsMate=require("ejs-mate")
const mongoose=require("mongoose")
const path=require("path")
const methodOverride=require("method-override")
const session = require("express-session");
//session                     
const MongoStore=require("connect-mongo");
// to flash a text on our page it will be displayed only once
const flash=require("connect-flash")
const expErr=require("./utils/expressError.js")

app.set("view engine","ejs")
app.engine('ejs', ejsMate); 
app.set("views",path.join(__dirname,"views"))
app.use(express.static(path.join(__dirname,"public")))  
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))

const Listening=require("./models/listening.js")
const MONGO_URL="mongodb://127.0.0.1:27017/wonderlust"
const DB_URL=process.env.ATLASDB_URL || MONGO_URL;
//!ROUTES
const listingRoute=require("./routes/listings.js")
const reviewRoute=require("./routes/review.js")
const userRoute=require("./routes/user.js")
// AUTHENTICATION
const passport=require("passport")
const LocalPassport=require("passport-local")
const User=require("./models/user.js")

main().then(()=>{
    console.log("Connection sucess");
}).catch((err)=>{
    console.log(err); 
})
async function main() {
    await mongoose.connect(DB_URL);
}
const store=MongoStore.create({
    mongoUrl:DB_URL,
    crypto:{
        secret:process.env.SECRET || 'defaultSecret'
    },
    touchAfter:24*3600,
})
store.on("error",()=>{
    console.log("ERROR IN MONGO SESSION");
})
const sessionOptions = {
   store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // in milliseconds
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    //secure: false // set to true if using HTTPS
  }
};
app.use(session(sessionOptions));
// app.use(session(sessionOptions));
app.use(flash())
// PASSPORT --AUTHENTICATION
app.use(passport.initialize());
app.use(passport.session());
// app.use(bodyParser.urlencoded({ extended: true }));
passport.use(new LocalPassport(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.set('view cache', false);
// USING LISTINGS FROM ROUTE-LISTINGS  /listings is a path frm show routes and listing is from routes folder
app.use((req,res,next)=>{  // sucess
  //  console.log(req.user);
    
    res.locals.sucess=req.flash("sucess")
    res.locals.error=req.flash("error")
    //INORDER TO CHECK WITH LOGIN,SIGNUP ND LOGOUT
    res.locals.currusr=req.user || null;
    next();
})

app.use("/listings",listingRoute)
app.use("/listings/:id/reviews",reviewRoute)
app.use("/",userRoute)

app.all("*",(req,res,next)=>{
    next(new expErr(404,"Page is not availabale.."))
})

// !INORDER TO SEND CUSTOM ERRORS
// app.use((err,req,res,next)=>{
//     let {status,message}=err;
//    res.status(status).send(message)//   res.status(statusCode).render("error.ejs", { err });
   // res.send("SOMETHING WENT WRONG")
// })
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("error.ejs", { message });
});
app.listen(8080,()=>{
    console.log("Express is listening");
})
 
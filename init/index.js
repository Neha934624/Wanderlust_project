const mongoose=require("mongoose")
const initData=require("./data.js")
const Listening=require("../models/listening.js")
const wrapAsync=require("../utils/wrapAsync.js")
const expErr=require("../utils/expressError.js")
const {listingSchema,reviewSchema}=require("../schema.js")

const MONGO_URL="mongodb://127.0.0.1:27017/wonderlust"
main().then(()=>{
    console.log("Connection sucessFULL");
}).catch((err)=>{
    console.log(err); 
})
async function main() {
    await mongoose.connect(MONGO_URL); 
}

let initDB= async ()=>{
    await Listening.deleteMany({})
    // initData.data=initData.data.map((obj)=>({ ...obj,owner:"6732bc6f1b689ffb958526c0"}))
    // console.log(owner)
    await Listening.insertMany(initData.data)
    console.log("initialized"); 
}

main().then(async ()=>{
    await initDB()
}).catch((e)=>{
    console.log(e);
})



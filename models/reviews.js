let mongoose=require("mongoose");

let Schema=mongoose.Schema;
let reviewSchema=new Schema({
    comment:{
        type:String,
    },
    rating:{
        type:Number,
        min:0,
        max:5,
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
})
module.exports=mongoose.model("Reviews",reviewSchema);


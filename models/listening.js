const mongoose=require("mongoose");
const { type } = require("../schema");
const { ref } = require("joi");
const rev=require("./reviews")
const Schema=mongoose.Schema;
let listeningSchema=new Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
    },
    image:{
        filename:{
            type:String,
        },
        url:{
            type:String,
        },
    },
    price:{
        type:Number,
    },
    location:{
        type:String,
    },
    country:{
        type:String,
    },
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Reviews"
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
})
// IN ORDER TO DELETE THE SAME THINGS IN DB WHEN WE HAVE DELETED THE POST
listeningSchema.post("findOneAndDelete",async(getlist)=>{
    if(getlist){
        await rev.deleteMany({_id:{$in : getlist.reviews}})
    }
})
let Listening=mongoose.model("Listening",listeningSchema)
module.exports=Listening;
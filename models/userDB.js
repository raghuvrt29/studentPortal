const mongoose=require("mongoose");

const userSchema=new mongoose.Schema({
    _id:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    dept:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        required:true,
        default:"student"
    },
    courses:[
        {
            courseId:{
                type:String,
                required:true
            }
        }
    ]
});

const user=mongoose.model("User",userSchema)
module.exports=user
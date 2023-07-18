const mongoose=require("mongoose");

const adminSchema= new mongoose.Schema({
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
        required:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        default:"admin"
    },
    departments:[
        {
            departmentId:{
                type:String,
                required:true
            }
        }
    ]
})

const admin=mongoose.model("Admin",adminSchema);
module.exports=admin;
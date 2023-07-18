const mongoose=require("mongoose");

const deptSchema=new mongoose.Schema({
    _id:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true,
        unique:true
    },
    hod:{
        type:String,
        required:true
    },
    courses:[
        {
            courseId:{
                type:String,
                required:true
            }
        }
    ],
    users:[
        {
            userId:{
                type:String,
                required:true
            }
        }
    ]
})

const dept=mongoose.model("Dept",deptSchema)
module.exports=dept;
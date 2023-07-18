const mongoose=require("mongoose");

const courseSchema=new mongoose.Schema({
    _id:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true,
        unique:true
    },
    dept:{
        type:String,
        required:true
    },
    teacherId:{
        type:String,
        required:true
    },
    resources:[
        {
            fileName:{
                type:String,
                required:true
            }
        }
    ],
    students:[
        {
            studentId:{
                type:String,
                required:true
            },
            marks:{
                type:Number,
                default:0
            }
        }
    ]
})

const course=mongoose.model("Course",courseSchema);
module.exports=course;
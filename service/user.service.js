const User = require("../models/userDB");

const userService = {
    addUser: async user => {
        try {
            return await new User(user).save();
        }
        catch (error) {
            throw error;
        }
    },
    delUser: async(user)=>{
        try{
            return await User.findByIdAndDelete(user._id);
        }
        catch(error){
            throw error;
        }
    },
    getUserById: async id => {
        try {
            return await User.findById(id);
        }
        catch (error) {
            throw error
        }
    },
    getUserByEmail: async email => {
        try {
            return await User.findOne({ email: email });
        }
        catch (error) {
            throw error
        }
    },
    addCourse: async (user, course) => {
        try {
            const update=await User.updateOne(
                {_id:user._id},
                { $push:
                    {courses:
                        {courseId:course._id}
                    }
                });
            return update;
        }
        catch (error) {
            throw error
        }
    },
    delCourse: async (userId, course) => {
        try {
            return await User.updateOne(
                { _id: userId },
                { $pull: { courses: { courseId: course._id } } }
            )
        }
        catch (error) {
            throw error
        }
    },
    changePassword: async (user,newPassword) =>{
        try{
            return await User.updateOne(
                {_id:user._id},
                {$set:{
                        password:newPassword
                    }
                });
        }
        catch(error){
            throw error;
        }
    },
    editDetails:async (userId,obj) =>{
        try{
            return await User.updateOne(
                {_id:userId},
                {$set:obj}
            )
        }
        catch(error){
            throw error;
        }
    },
    toHod: async userId =>{
        try{
            return await User.updateOne(
                {_id:userId},
                {
                    $set:{
                        role:"hod"
                    }
                }
            );
        }
        catch(error){
            throw error;
        }
    },
    toTeacher: async userId =>{
        try{
            return await User.updateOne(
                {_id:userId},
                {
                    $set:{
                        role:"teacher"
                    }
                }
            );
        }
        catch(error){
            throw error;
        }
    }
}

module.exports = userService;
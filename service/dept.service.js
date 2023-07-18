const Dept=require("../models/deptDB");

const deptService={
    addDept:async dept =>{
        try{   
            return await Dept(dept).save();
        }
        catch(error){
            throw error;
        }
    },
    changeHod: async newHod =>{
        try{
            return await Dept.updateOne(
                {_id:newHod.dept},
                {
                    $set:{
                        hod:newHod._id
                    }
                }
            );
        }
        catch(error){
            throw error;
        }
    },
    getDeptById: async deptId =>{
        try{
            return await Dept.findById(deptId);
        }
        catch(error){
            throw error;
        }
    },
    getDeptByName: async deptName =>{
        try{
            return await Dept.findOne({name:deptName});
        }
        catch(error){
            throw error;
        }
    },
    addUser: async user =>{
        try{
                const update=await Dept.updateOne(
                    {_id:user.dept},
                    { $push:
                        {users:
                            {userId:user._id}
                        }
                    });
                return update;
        }
        catch(error){
            throw error;
        }
    },
    delUser: async user=>{
        try{
            return await Dept.updateOne(
                {_id:user.dept},
                { $pull:
                    {users:
                        {userId:user._id}
                    }
                });
        }
        catch(error){
            throw error;
        }
    },
    addCourse: async (deptId,course) =>{
        try{
            const update=await Dept.updateOne(
                {_id:deptId},
                { $push:
                    {courses:
                        {courseId:course._id}
                    }
                });
            return update;
        }
        catch(error){
            throw error;
        }
    },
    delCourse: async (course) =>{
        try{
            return await Dept.updateOne(
                {_id:course.dept},
                { $pull:
                    {courses:
                        {courseId:course._id}
                    }
                });
        }
        catch(error){
            throw error;
        }
    }
}

module.exports=deptService;
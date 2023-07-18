const Admin=require("../models/adminDB");

const adminService={
    addAdmin: async admin=>{
        try{
            return await Admin(admin).save();
        }
        catch(error){
            throw error;
        }
    },
    getAdminById: async adminId =>{
        try{
            return await Admin.findById(adminId);
        }
        catch(error){
            throw error;
        }
    },
    getAdminByEmail: async adminEmail =>{
        try{
            return await Admin.findOne({email:adminEmail});
        }
        catch(error){
            throw error;
        }
    },
    addDept: async (admin,deptId) =>{
        try{
            const update=await Admin.updateOne(
                {_id:admin._id},
                { $push:
                    {departments:
                        {departmentId:deptId}
                    }
                });
            return update;
        }
        catch(error){
            throw error;
        }
    }
}

module.exports=adminService;
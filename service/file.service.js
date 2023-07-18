const fs=require("fs-extra");

const fileService={
    addFolder: async (deptId,courseId)=>{
        try{
            fs.mkdirSync("./uploads/" + deptId + "/" + courseId, (error) => {
                if (error)
                    throw error;
            });
        }
        catch(error){
            throw error;
        }
    },
    delFolder: async (deptId,courseId)=>{
        try{
            return fs.removeSync("./uploads/" + deptId + "/" + courseId, (error) => {
                if (error)
                    throw error;
            });
        }
        catch(error){
            throw error;
        }
    },
    delFile: async (filePath) =>{
        try{
            return fs.unlinkSync(filePath);
        }
        catch(error){
            throw error;
        }
    }
}

module.exports=fileService
const multer=require("multer");
const path=require("path");

const multerStorage= multer.diskStorage({
    destination: (req,file,cb) =>{
        cb(null,"uploads/"+req.params.deptId+'/'+req.params.courseId);
    },
    filename: (req,file,cb) =>{
        const ext= file.mimetype.split('/')[1];
        cb(null,file.fieldname+'_'+path.parse(file.originalname).name+'_'+Date.now()+'.'+ext);
    }
});

const multerFilter= (file,cb) =>{
    if(file.mimetype.split("/")[1])
        cb(null,true);
    else
        cb(new Error("invalid file extension"),false);
};
const upload=multer({
    storage:multerStorage,
    fileFilter:multerFilter
});

module.exports=upload;
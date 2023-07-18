const express=require("express");
const bodyParser=require("body-parser");
const userRoute=require("./routes/user.route");
const adminRoute=require("./routes/admin.route");
const deptRoute=require("./routes/dept.route");
const refresh=require("./utils/refresh");
const {connectTodb}=require("./utils/db");

const app=express();

app.use(bodyParser.urlencoded({
    extended:true
}));

app.get("/",(req,res)=>{
    res.send("welocome to student-portal");
})

app.use("/users",userRoute);

app.use("/admin",adminRoute);

app.use("/depts",deptRoute);

app.post("/refresh",refresh)

app.listen(3000,async(req,res)=>{
    await connectTodb();
    console.log("started");
})


const {MongoClient}=require('mongodb');

// const url="mongodb://mongo:27017/studentPortal"
const url="mongodb://localhost:27023/studentPortal"
const client= new MongoClient(url,{ useNewUrlParser: true, useUnifiedTopology: true });

async function connectTodb(){
    try{
        await MongoClient.connect(url,{ useNewUrlParser: true, useUnifiedTopology: true });
        console.log("db connected");
    }
    catch(error){
        console.log("connection failed");
        process.exit(1);
    }
}

module.exports={
    connectTodb,
    getClient: ()=>{
        return client;
    }
}
require('dotenv')
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/NodeJS_EMS")
.then(()=>{
    console.log("db connected");
})
.catch((err)=>console.log(err))
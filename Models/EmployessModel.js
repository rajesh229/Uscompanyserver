const mongoose = require("mongoose")
const schema = mongoose.Schema;

const Employee = new schema({
    Name:String,
    Gender:String,
    Mobilenumber:Number,
    Emailid:String,
    Desiganation:String,
    Password:String,
    isadmin:Boolean,
    
    
})

mongoose.model("Employees", Employee);
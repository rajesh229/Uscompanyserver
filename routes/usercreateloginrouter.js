const mongoose = require("mongoose");

const express = require("express");
const jwt=require("jsonwebtoken");
const router = express.Router();
const employee=require("../Models/EmployessModel");
const Employee = mongoose.model("Employees");
const bcryptjs = require('bcryptjs');
router.post("/empsave",(req,res)=>{
   // console.log("hi");
    bcryptjs.hash(req.body.Password,10).then(hash=>{
    let employee =new Employee({
        Name:req.body.Name,
        Gender:req.body.Gender,
        Mobilenumber:req.body.Mobilenumber,
        Emailid:req.body.Emailid,
        Desiganation:req.body.Desiganation,
        Password:hash,
        isadmin:req.body.isadmin,
    })
    employee.save((err,result)=>{
        // res.send(result)
     if(err){
        res.status(400).json({
            message:"Unable Create User",
            err:err,
            result:''
            
        })
       // res.send(result);
     }else{
         console.log(result);
    // res.send("user Created Succefully")
         res.status(200).json({
             message:"user Created  Succefully",
             err:null,
             result:result
             
         })
        // res.send(result);
     }
     
     })
}).catch(err=>{
    res.send(err);
})
})

router.post('/login',(req,res) => {
    let userDetails;
    Employee.findOne({$or:[{Name:req.body.Name},{Emailid:req.body.Name}]}).then(userd => {
        userDetails = userd
        if(!userd) {
       let obj=  {
                message: 'No User Found',
                status: 404,
                error: null,
                token: null,
                status:404
            }
            res.send(obj);
        }

        bcryptjs.compare(req.body.Password,userd.Password).then(isMatch => {
            if(!isMatch) {
               let obj={
                    message: 'Password incorrect',
                    status: 404,
                    error: null,
                    token: null
                }
                res.send(obj);
            }


          let token =jwt.sign({Name: userDetails.Name, userId:userDetails._id,Desiganation:userDetails.Desiganation},'thisissecretkeyanditisverylong')

                        if(token) {
                            return res.status(200).json({
                                message: 'Login Successful',
                                status: 200,
                                error:null,
                                result: userDetails,
                                token: token
                            })
                        } else {
                            let obj={
                                message: 'Unable to generate token',
                                status: 404,
                                error: null,
                                token: null
                            }
                            res.send(obj);
                        }
        })
    }).catch(err => {
        console.log(err)

    })
})
router.get("/getallusers",(req,res)=>{
    
    let loginuserdata=parseJwt(req.header('Authorization'));
    if(loginuserdata){
        if(loginuserdata.Desiganation=="Admin"){
    Employee.find({ Desiganation: { $nin: [ "Admin" ] } }).then(result=>{
        if(result){
            res.status(200).json({
                message:"users Found  Succefully",
                err:null,
                result:result
                
            })
        }else{
           let obj= {
                message:"users Not Found",
                err:null,
                result:result,
                status:404
            }
            res.send(obj);
        }
        
    })
}else{
    let obj={
        message:"You are Not Authorised!",
        err:null,
        result:'',
        status:580
    }
    res.send(obj)
}
}else{
    let obj={
        message:"You are Not Authorised!",
        err:null,
        result:'',
        status:580
    }
    res.send(obj)
}
})
function parseJwt(token) {
    var base64Payload = token.split('.')[1];
    var payload = Buffer.from(base64Payload, 'base64');
    return JSON.parse(payload.toString());
  }
router.get("/getstaffony",(req,res)=>{
    let loginuserdata=parseJwt(req.header('Authorization'));
    if(loginuserdata){
        if(loginuserdata.Desiganation=="Manager"){
    Employee.find({ Desiganation: { $nin: [ "Admin","Manager" ] } }).then(result=>{
        if(result){
            res.status(200).json({
                message:"users Found  Succefully",
                err:null,
                result:result
                
            })
        }else{
            res.status(404).json({
                message:"users Not Found",
                err:null,
                result:result
                
            })
        }
        
    })
}else{
    let obj={
        message:"You are Not Authorised!",
        err:null,
        result:'',
        status:580
    }
    res.send(obj)
}
}else{
    let obj={
        message:"You are Not Authorised!",
        err:null,
        result:'',
        status:580
    }
    res.send(obj);
}
})

router.delete("/removeuser/:id",(req,res)=>{
    console.log(req.params.id)
    let loginuserdata=parseJwt(req.header('Authorization'));
    if(loginuserdata){
        if(loginuserdata.Desiganation=="Admin"){
    Employee.deleteOne({_id:req.params.id}).then(result=>{
        console.log(result);
        if(result.n==1 && result.ok==1 && result.deletedCount==1){
            res.status(200).json({
                message:"user Delete  Succefully",
                err:null,
                result:result
                
            })
        }else{
            res.status(404).json({
                message:"Unable to Delete users",
                err:null,
                result:result
                
            })
        }
    })
}else{
    let obj={
        message:"You are Not Authorised!",
        err:null,
        result:'',
        status:580
    }
    res.send(obj)
}
}else{
    let obj={
        message:"You are Not Authorised!",
        err:null,
        result:'',
        status:580
    }
    res.send(obj);
}
})
module.exports = router;
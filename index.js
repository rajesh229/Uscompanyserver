const express = require("express")
const mongoose = require("mongoose")
const bodyparser = require("body-parser")
const app = express();
const appConfig = require("./appConfig/appconfig")
employeess=require("./routes/usercreateloginrouter")
// const nodeldata=require("./routers/Nobelpricegetroute")
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: false }))
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "PUT, POST, GET,DELETE")
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

app.listen(appConfig.port, () => {
    let db = mongoose.connect(appConfig.db.url, ({ useNewUrlParser: true }))
})
app.use("/Employess",employeess)
mongoose.connection.on("err", function (err) {
    if (err) {
        console.log(err)
    } else {
        console.log("connection OK")
    }
})
mongoose.connection.on("open", function (err) {
    if (err) {
        console.log(err)
    } else {
        console.log("Connection Succefully!")
    }
})

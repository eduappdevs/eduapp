const cors = require('cors');
const express = require('express');
const PORT = 3003;
const app = express();
app.use(cors());
app.use("/",express.static(__dirname + "/helpndoc"))
app.use("/",(req,res)=>{
    res.sendFile(__dirname + "/helpndoc/AboutEduapp.html")
})
app.listen(PORT,()=>{
    console.log("listening on ", PORT);
    console.log(__dirname);
})
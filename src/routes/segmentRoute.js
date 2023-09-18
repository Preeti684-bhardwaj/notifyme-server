const express=require('express')
const router=express.Router()
const {getAllSegment} = require("../controller/segmentController")

//========================================= Controller =======================================================//

router.get("/getAllSegment", getAllSegment);


module.exports=router
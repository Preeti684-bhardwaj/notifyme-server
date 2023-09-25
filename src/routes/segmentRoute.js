const express=require('express')
const router=express.Router()
const {getAllSegment , sendNotification} = require("../controller/segmentController")

//========================================= Controller =======================================================//

router.get("/getAllSegment", getAllSegment);
router.post("/sendNotification", sendNotification);

module.exports=router
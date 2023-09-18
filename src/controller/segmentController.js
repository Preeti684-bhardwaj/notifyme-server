
const getAllSegment = async (req , res )=>{

    console.log("GetAllSegment")

    res.json({
        success : true,
        message : "All Segment Are get"
    })
}

module.exports = {getAllSegment}
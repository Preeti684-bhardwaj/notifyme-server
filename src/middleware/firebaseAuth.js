const admin =  require("../config/firebaseConfig")

const authFirebase = (req , res , next)=>{

    const token = req.headers.authorization.split(" ")

    try{

        const decodeValue = admin.auth().verifyIdToken(token)

        if(decodeValue){
            return next()
        }
        return res.status(401).json({
            success : false,
            message : "UnAuthorized"
        })
    }catch(e){
        return res.status(500).json({
            success : false,
            message : "Internal Server Error"
        })
    }
}

module.exports = {authFirebase}
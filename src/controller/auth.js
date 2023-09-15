const {authorize , redirects} = require("../utils/shopifyAuthHelper")


const auth = async(req , res)=>{
    console.log(req.query.shop)
    return res.redirect(await authorize(req.query.shop))
}

const redirection = async(req , res)=>{
    return res.json(await redirects(req.query.code , req.query.shop))
}

module.exports = {auth , redirection}
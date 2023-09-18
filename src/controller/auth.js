const {authorize , redirects} = require("../utils/shopifyAuthHelper")


const auth = async(req , res)=>{
    console.log(req.query.shop)
    const data = res.redirect(await authorize(req.query.shop))
    console.log(data)
}

const redirection = async(req , res)=>{
    return res.json(await redirects(req.query.code , req.query.shop))
}

module.exports = {auth , redirection}
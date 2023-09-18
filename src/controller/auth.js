const {authorize , redirects} = require("../utils/shopifyAuthHelper")


const auth = async(req , res)=>{
    console.log(req.query.shop)
    res.redirect(await authorize(req.query.shop))
}

const redirection = async(req , res)=>{
    const data = (await redirects(req.query.code , req.query.shop))
    console.log(data)
    res.json(data)
}

module.exports = {auth , redirection}
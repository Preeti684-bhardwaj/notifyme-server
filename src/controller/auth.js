const {authorize , redirects} = require("../utils/shopifyAuthHelper")


const auth = async(req , res)=>{
    console.log(req.query.shop)
    res.redirect(await authorize(req.query.shop))
}

const redirection = async(req , res)=>{
    const data = (await redirects(req.query.code , req.query.shop))

    process.env.shopify_token = data.access_token
    process.env.shop = req.query.shop


    return res.json({
        success : true,
        message : "Authorization Done!"
    })
}

module.exports = {auth , redirection}
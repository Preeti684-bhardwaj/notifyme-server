const axios = require("axios")

const authorize = async(shop)=>{
    console.log("Enter")
    return encodeURI(`https://${shop}/admin/oauth/authorize?client_id=${process.env.client_id}&scope=${process.env.scope}&redirect_uri=${process.env.redirect_uri}`)
}

const redirects = async(code , shop)=>{
    const shopifyOAuthUri = `https://${shop}/admin/oauth/access_token?client_id=${process.env.client_id}&cope=${process.env.scope}&client_secret=${process.env.client_secret}&code=${code}`

    const {data}=await axios({
        url:shopifyOAuthUri,
        method:'post',
        data : {}
    }).then(response=>{
        console.log(response)
        return response
    }).catch(error=>{
        return error
    })
    console.log(data)
    return data
}

module.exports = {authorize , redirects}
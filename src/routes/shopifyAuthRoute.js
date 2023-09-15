const express = require("express")
const router = express.Router()
const {auth , redirection} = require("../controller/auth")

router.route("/api/shopify/authorize").get(auth)

router.route("/api/shopify/redirect").get(redirection)


module.exports = router
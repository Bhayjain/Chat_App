 const jwt = require("jsonwebtoken")

 const generateToken = (id) => {
    return jwt.sign({id}, process.env.Jwt_SECRET)
 }

 module.exports = generateToken

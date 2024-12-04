const jwt = require('jsonwebtoken');
let JWT_SECRET = "ShreeRam"


const checkToken = async(req,res,next)=>{
    try {
        let token = req.headers.authorization;
        // console.log(token)
        if(!token){
            return res.json({msg:"provide a token",success:false})
        }
    console.log(token)
    let decode = jwt.verify(token,JWT_SECRET );
    // console.log(decode)
    req.user = decode;
    next()
    } catch (error) {
       return res.json({msg:"token is not valid",success:false,error:error.message})
    }
// next()
}

module.exports = checkToken
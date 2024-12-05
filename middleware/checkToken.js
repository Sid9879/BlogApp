const jwt = require('jsonwebtoken');
let JWT_SECRET = "ShreeRam"


const checkToken = async(req,res,next)=>{
    try {
        let token = req.headers.authorization;
       
        if(!token){
            return res.json({msg:"provide a token",success:false})
        }
    console.log(token)
    let decode = jwt.verify(token,JWT_SECRET );
    
    req.user = decode;
    next()
    } catch (error) {
       return res.json({msg:"token is not valid",success:false,error:error.message})
    }
// next()
}

module.exports = checkToken
const jwt=require('jsonwebtoken');
const config=require('config');

module.exports=function (req,res,next) {
    //Get Token From Header

    const token=req.header('x-auth-token');

    //Check if not token

    if(!token){
        return res.status(401).json({
            msg:"No Token ,Authorize denied"
        });

    }

    //Verify token
    try {
        const decode=jwt.verify(token,config.get('jwtSecret'));

        req.user=decode.user;
        next();
    } catch (err) {
        res.status(401).json({
            msg:"TOken is not Valid"
        });
        
    }
    
}
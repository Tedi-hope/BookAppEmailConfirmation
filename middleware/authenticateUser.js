import jwt from "jsonwebtoken";

export const authenticateUser=(req,res,next)=>{
    const authHeader=req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(401).send({message:'Unauthorized:No token provided'});
    }

    const token=authHeader.split(' ')[1];// Extract token after "Bearer"
    //console.log(token);

    try{
      //Verify the token using the secret key
       const decoded=jwt.verify(token, 'secretCode@backend');//Replace with your environment variable in production
       
       //Ensure the token contains the expected fields
       if(!decoded || !decoded.isLogged){
        return res.status(403).json({message:'Invalid token payload'});
       }

       //Attach user info to the request
       //req.user={id:decoded.id};
       req.user=decoded
       //console.log('Authenticated User:', req.user.userId); // Add this log
       //Call the next middleware or route handler
       next();
    }

    catch(error){
      console.log(error.message);
      return res.status(403).send({message:'Unauthorized:Invalid or expired token'});
    }
};
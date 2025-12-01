import jwt from "jsonwebtoken";

// protect routes
export const protect=(req,res,next)=>{
    const token=req.headers.authorization?.split(' ')[1]; // bearer <token>
    if(!token) return res.status(401).json({message : 'No token, authorization denied'});

    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        req.user=decoded;  // add user info to request
        next();
    }catch(err){
        res.status(401).json({message : 'Token is not valid'});
    }
};

//role base request
export const authorize = (...roles)=>{
    return(req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return res.status(403).json({message : `Role (${req.user.role}) not allowed`});
        }
        next();
    };
};
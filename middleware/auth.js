import User from "../models/UserSchema.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config()

const getAuth = async(req, res, next)=>{
    try{
        const token = req.headers.token;  

        if(!token){
            res.status(401).json({error:"unauthorized"})
        }
        const verifyToken = jwt.verify(token,process.env.SECRET)
    
        // console.log(verifyToken);
        if(!verifyToken){
            return res.status(401).json({error:"unauthorized"})
        }

        const auth=await User.findById(verifyToken.id)

        req.userId=verifyToken.id
        req.auth=auth
        next()
    }
    catch(error){
        console.log(error.message);
        res.status(401).json({error:"unauthorized"})
    }
}
export default getAuth;
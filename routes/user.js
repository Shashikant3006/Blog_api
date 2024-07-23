import express from "express"
import User from "../models/UserSchema.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
// import e from "express"
import getAuth from "../middleware/auth.js";
const UserRouter = express.Router()

UserRouter.use(express.json())

UserRouter.get("/",async(req,res)=>{
    await User.find()
    .then((result)=>{
        res.status(200).json(result)
    })  
    .catch(err=>{
        res.status(400).json({error:err})
    })
})


UserRouter.post("/register",async(req,res)=>{
    const userExists = await User.findOne({email});
    if(userExists){
        res.status(400);
        throw new Error("User already exists");
    }
    try {
        const{name,email,password} = req.body;
        if(name&&email&&password){
        const hashPassword = await bcrypt.hash(password, 10);
        const user = await User.create({name,email,password:hashPassword});
        res.status(200).json({msg:"user registered successfully",user});
        }
        else{
            res.status(400).json({msg:"please fill the required filled"})
        }
        
    } catch (error) {
        // Handle errors (e.g., duplicate email, database error)
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    
})


// UserRouter.post("/login",async(req,res)=>{
//     try{
//         const{email, password}=req.body;
//         const existUser = await User.findOne({email})
//         if(!existUser){
//             res.status(404).json({error:"user not found"})
//         }
//         const comparePassword= await bcrypt.compare(password,existUser.password)
//         if(!comparePassword){
//             res.status(404).json({msg:"Wrong Password"})
//         }
//         const token=jwt.sign({id:existUser._id},process.env.SECRET)
//         res.status(201).json({msg:"User logged in", token:token})
//     }
//     catch(error){
//         res.status(400).json({error: error})
//         return ;
//     }
// })

UserRouter.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const existUser = await User.findOne({ email });
        if (!existUser) {
            return res.status(404).json({ error: "User not found" }); // return here to end the function execution
        }
        const comparePassword = await bcrypt.compare(password, existUser.password);
        if (!comparePassword) {
            return res.status(404).json({ error: "Wrong Password" }); // return here to end the function execution
        }
        const token = jwt.sign({ id: existUser._id }, process.env.SECRET);
        return res.status(201).json({ msg: "User logged in", token: token }); // return here to end the function execution
    } catch (error) {
        console.error("Error occurred during login:", error);
        return res.status(500).json({ error: "Internal Server Error" }); // Internal server error for any unexpected errors
    }
});




UserRouter.get("/auth",getAuth,(req,res)=>{
    res.status(200).json(req.auth)
})
export default UserRouter;

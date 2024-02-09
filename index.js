import express from "express";
import dotenv from "dotenv"
import cors from "cors"
import "./db/database.js"
import UserRouter from "./routes/user.js"
import BlogRouter from "./routes/blog.js"
import path from "path";


dotenv.config()

const port = process.env.PORT;
const app = express()

app.use(express.json())
app.use(cors())

app.get("/",(req,res)=>{
    res.setHeader("Access-Control-Allow-Credentials","true");
    res.send("API is running...");
});

app.use("/api/user",UserRouter) 
app.use("/api/blog",BlogRouter) 


app.use((req,res,next)=>{
    const error = new Error(`Not Found -${req.originalUrl}`);
    res.status(400);
    next(error);
})
app.use((err,req,res,next)=>{
    const statusCode = res.statusCode === 200? 500: res.statusCode;
    res.status(statusCode);
    res.json({
        message:err.message,
        stack:process.env.NODE_ENV === "prdouction"? null :err.stack,
    });
    next();
})


const PORT = process.env.PORT || 7000;

app.listen(port,()=>{
    console.log("app is running on port",port);
})

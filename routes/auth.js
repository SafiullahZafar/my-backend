import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const router =express.Router();

// registeration 
router.post('/register', async (req,res)=>{
    try{
        const {name,email,password,role} = req.body;
        // check if user exist 
        const existingUser= await User.findOne({email});
        if(existingUser) return res.status(400).json({message : 'User already exist'});
        // hash pasword 
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);
        // create user 
        const user=await User.create({
            name,
            email,
            password :hashedPassword,
            role: role  || 'user',  //default role as user
        });
        // create jwt token 
        const token=jwt.sign(
            {id:user._id, role :user.role},
            process.env.JWT_SECRET,
            {expiresIn:'1d'}
        );
        res.status(201).json({
            message : 'User added successfully',
            token,
            user :{id:user._id , name:user.name , email:user.email , role:user.role}
        });
    }catch(err){
        res.status(500).json({message:'Server error',error :err.message});
    }
});
// Login 
router.post('/login', async(req,res)=>{
    try{
        const {email,password}=req.body;
        // check's user exist 
        const user=await User.findOne({email});
        if(!user) return res.status(400).json({message:'Invalid credentials'});
        // compair password 
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch) return res.status(400).json({message:'Invalid credentials'});
        // create jwt 
        const token=jwt.sign(
            {id:user._id,role:user.role},
            process.env.JWT_SECRET,
            {expiresIn:'1d'}
        );
        res.status(200).json({
            message:'Login successfully',
            token,
            user : {id:user._id , name:user.name , email:user.email , role:user.role}
    });
    }catch(err){
        res.status(500).json({message:'Server error', error:err.message});
    }
});

export default router;
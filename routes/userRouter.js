import express from 'express'
import { protect,authorize} from '../middleware/authMiddleware.js';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const router=express.Router();

// update profile 
    router.put('/profile',protect,async(req,res)=>{
    try{
    const user=await User.findById(req.user.id);
    if(!user) return res.status(404).json({message :'User not found'});

    const {name,password}=req.body;
    if(name) user.name=name;
    if(password) user.password=await bcrypt.hash(password,10);

    await user.save();
    res.json({message:'Profile updated successfully'})
    }catch(err){
    res.status(500).json({message:'Server error', error:err.message})
}
});

export default router;
import express from 'express'
import Task from '../models/Task.js'
import { protect } from '../middleware/authMiddleware.js'

const router= express.Router();

// create task 
router.post('/',protect,async(req,res)=>{
    try{
        const task =new Task({...req.body, user: req.user.id});
        await task.save();
        res.json(task);
    }catch(err){
        res.status(500).json({message : err.message})
    }
});

// get all tasks (admin) or user's tasks
router.get('/',protect,async(req,res)=>{
    try{
        let tasks;
        if(req.user.role==='admin'){
            tasks=await Task.find().populate('user','name email role');
        }else{
            tasks=await Task.find({user:req.user.id});
        }
        res.json(tasks);
    }catch(err){
        res.status(500).json({message:err.message});
    }
});

// Update tasks / dargging
router.put('/:id', protect, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        // Only owner or admin can update
        if (req.user.role !== 'admin' && task.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        // Update fields (including drag-drop)
        Object.assign(task, req.body);

        await task.save();
        res.json(task);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// Delete Task 
router.delete('/:id',protect,async(req,res)=>{
    try{
        const task=await Task.findById(req.params.id);
        if(!task) return res.status(404).json({message : 'Task not found'});

        // Only owner or admin can delete 
        if(req.user.role!=='admin'&&task.user.toString()!==req.user.id){
            return res.status(403).json({message : 'Forbidden'});
        }
        await task.deleteOne();
        res.json({message : 'Task deleted'});
    }catch(err){
        res.status(500).json({message : err.message });
    }
});

export default router;
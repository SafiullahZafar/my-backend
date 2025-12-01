import mongoose from "mongoose";

const TaskSchema=new mongoose.Schema({
    title:{type:String,required :true},
    description :{type: String},
    user :{type :mongoose.Schema.Types.ObjectId,ref:'User'}, //task owner
    status:{type:String, enum :['pending','in process','completed'],default:'pending'},
},{timestamps :true});

export default mongoose.model('Task',TaskSchema);
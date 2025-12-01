import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
    user: { type: String, required: true },
    message: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('Comment', commentSchema);

const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    status: { 
        type: String, 
        enum: ['pending', 'completed', 'incomplete'],
        default: 'pending' 
    },
    createdAt: { type: Date, default: Date.now },
    deadline: { type: Date, required: true }, // Add deadline field
});

const Task = mongoose.model('Task', TaskSchema);
module.exports = Task;

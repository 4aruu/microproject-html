// routes/taskRoutes.js
const express = require('express');
const Task = require('../models/user_model'); // Ensure this path is correct
const router = express.Router();

// Create a new task
router.post('/tasks', async (req, res) => {
    const { title, description, priority, deadline } = req.body;  // Capture deadline

    if (!title || !priority || !deadline) {
        return res.status(400).json({ message: 'Title, Priority, and Deadline are required' });
    }

    try {
        const task = new Task({
            title,
            description,
            priority,
            status: 'pending',  // Default status
            deadline,  // Save the provided deadline
        });

        await task.save();
        res.status(201).json({ message: 'Task created successfully', task });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating task' });
    }
});

// Get all tasks
router.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find();  // Fetch all tasks
        res.json(tasks);  // Send tasks including deadline
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching tasks' });
    }
});

// Update a task by ID
router.put('/tasks/:taskId', async (req, res) => {
    const { taskId } = req.params;
    const { title, description, priority, deadline } = req.body;

    try {
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        task.title = title || task.title;
        task.description = description || task.description;
        task.priority = priority || task.priority;
        task.deadline = deadline || task.deadline;  // Update the deadline if provided

        await task.save();
        res.json({ message: 'Task updated successfully', task });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating task' });
    }
});

// Delete a task by ID
// Delete a task by ID
// Delete a task by ID
router.delete('/tasks/:taskId', async (req, res) => {
    const { taskId } = req.params;

    try {
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        await task.deleteOne();  // Use deleteOne instead of remove
        res.json({
            message: 'Task deleted successfully',
            deletedTask: {
                title: task.title,
                description: task.description,
                priority: task.priority,
                status: task.status,
                deadline: task.deadline
            }
        });
    } catch (error) {
        console.error("Error deleting task:", error);
        res.status(500).json({ message: 'Error deleting task', error: error.message });
    }
});





module.exports = router;

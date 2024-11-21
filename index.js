const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/users.js'); // Import the user model
const bodyParser = require('body-parser');
const cors = require('cors');
const taskRoutes = require('./routes/user_routes'); // Ensure the path is correct
 


const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(taskRoutes); // This will add all routes from `user_routes.js` to the app

// Connect to MongoDB
mongoose.connect('mongodb+srv://aaronjacobsunil:adithaaron@taskp0.hm3uz.mongodb.net/?retryWrites=true&w=majority&appName=TaskP0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Database connected.");
}).catch(err => {
    console.log("Database connection error:", err);
});

// Registration Route
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const newUser = new User({ username, password });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Login Route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

const port = process.env.PORT || 5550;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// Basic Express server setup for TaskShare backend
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/taskshare', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

// Placeholder route
app.get('/', (req, res) => {
  res.send('TaskShare backend is running!');
});

// Import and use authentication routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Import and use task routes
const taskRoutes = require('./routes/tasks');
app.use('/api/tasks', taskRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

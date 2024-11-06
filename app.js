const express = require('express')
const dotenv = require('dotenv')
dotenv.config()
const connectDB = require('./config/db')
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(express.json());

app.use('/api/auth', authRoutes)
app.use('/api', userRoutes)

// Handle unknown routes
app.use((req, res, next) => {
    res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware for server errors
app.use((err, req, res, next) => {
    res.status(500).json({ error: 'Server error, please try again later' });
});

const PORT = process.env.PORT || 5000;

const start = async () => {
    try {
        await connectDB(process.env.MONGODB_URI)
        app.listen(PORT, () => {
            console.log(`server running http://localhost:${PORT}`)
        }) 
    } catch(error) {
        console.log(error)
    }
}
start()

import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
import axios from 'axios';  // Import axios for API requests

// Initialize Express app
const app = express();

// Configuration and database connections
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

// Middlewares
app.use(express.json());
app.use(cors());

// Define routers for API endpoints
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);

// Test route to check API status
app.get('/', (req, res) => {
    res.send("API Working");
});

// Define the recommendation route to connect with the Flask API
const flaskBaseURL = 'https://your-ngrok-url.ngrok.io';  // Replace with the actual URL

app.post('/api/recommend', async (req, res) => {
    try {
        const { equipment, top_n } = req.body;
        const response = await axios.post(`${flaskBaseURL}/recommend`, { equipment, top_n });
        res.json(response.data);
    } catch (error) {
        console.error('Error calling Flask API:', error.message);
        res.status(500).json({ success: false, message: 'Error fetching recommendations' });
    }
});

// Start the server
app.listen(port, () => {
    console.log('Server started on PORT : ' + port);
});

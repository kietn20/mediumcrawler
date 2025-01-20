import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api.js';
import axios from 'axios';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'https://mediumcrawler.vercel.app', // Frontend domain
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));
app.use(express.json());

// Routes
app.use('/api', apiRoutes);

// Proxy server route
app.get('/proxy', async (req, res) => {
  const { url } = req.query;
  if (!url) {
    return res.status(400).send('URL is required');
  }

  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const contentType = response.headers['content-type'];
    res.set('Content-Type', contentType);
    res.send(response.data);
  } catch (error) {
    res.status(500).send('Error fetching the image');
  }
});

// Error handling middleware
app.use((req, res, next) => {
  console.log('CORS headers:', res.get('Access-Control-Allow-Origin'));
  next();
});

// Start the main server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
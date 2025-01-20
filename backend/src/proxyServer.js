import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();
const PORT = 3001; // You can use any port

app.use(cors());

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

app.listen(PORT, () => {
  console.log(`Proxy server is running on port ${PORT}`);
});
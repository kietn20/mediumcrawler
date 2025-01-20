import express from 'express';
import mediaService from '../service/mediaService.js';

const router = express.Router();

// Search all media
router.get('/search', async (req, res) => {
  try {
    const { query, page, type } = req.query;
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    let results;
    switch (type) {
      case 'Movie | TV Show | Anime':
        results = await mediaService.searchTmdb(query, page);
        break;
      case 'Manga':
        results = await mediaService.searchAnilist(query);
        break;
      case 'Video Game':
        results = await mediaService.searchRawg(query, page);
        break;
      case 'Book':
        results = await mediaService.searchOpenLibrary(query, page);
        break;
      default:
        return res.status(400).json({ error: 'Invalid media type' });
    }

    console.log('Search Results:', results);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
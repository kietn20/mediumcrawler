import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

class MediaService {
  constructor() {
    this.tmdbApi = axios.create({
      baseURL: 'https://api.themoviedb.org/3',
      params: {
        api_key: process.env.TMDB_API_KEY
      }
    });

    this.rawgApi = axios.create({
      baseURL: 'https://api.rawg.io/api',
      params: {
        key: process.env.RAWG_API_KEY
      }
    });

    this.openLibraryApi = axios.create({
      baseURL: 'https://openlibrary.org'
    });

    this.anilistApi = axios.create({
      baseURL: 'https://graphql.anilist.co'
    });
  }

  // Helper to format TMDB results
  formatTmdbResults(results) {
    return results.map(item => ({
      id: item.id,
      title: item.title || item.name, // movies use 'title', TV shows use 'name'
      imageUrl: item.poster_path
        ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
        : null
    }));
  }

  // Helper to format RAWG results
  formatRawgResults(results) {
    return results.map(item => ({
      id: item.id,
      title: item.name,
      imageUrl: item.background_image
    }));
  }

  // Helper to format OpenLibrary results
  formatOpenLibraryResults(results) {
    return results.map(item => ({
      id: item.key,
      title: item.title,
      imageUrl: item.cover_i
        ? `https://covers.openlibrary.org/b/id/${item.cover_i}-L.jpg`
        : null
    }));
  }

  // Helper to format Anilist results
  formatAnilistResults(results) {
    return results.map(item => ({
      id: item.id,
      title: item.title.romaji,
      imageUrl: item.coverImage.large
    }));
  }

  // Search for movies and TV shows
  async searchTmdb(query, page = 1) {
    try {
      const [moviesRes, tvRes] = await Promise.all([
        this.tmdbApi.get('/search/movie', { params: { query, page } }),
        this.tmdbApi.get('/search/tv', { params: { query, page } })
      ]);

      const allResults = [
        ...this.formatTmdbResults(moviesRes.data.results),
        ...this.formatTmdbResults(tvRes.data.results)
      ];

      return allResults;
    } catch (error) {
      console.error('TMDB API Error:', error.message);
      throw new Error('Failed to search media');
    }
  }

  // Search for video games
  async searchRawg(query, page = 1) {
    try {
      const gamesRes = await this.rawgApi.get('/games', { params: { search: query, page } });
      return this.formatRawgResults(gamesRes.data.results);
    } catch (error) {
      console.error('RAWG API Error:', error.message);
      throw new Error('Failed to search media');
    }
  }

  // Search for books
  async searchOpenLibrary(query, page = 1) {
    try {
      const booksRes = await this.openLibraryApi.get('/search.json', { params: { q: query, page } });
      return this.formatOpenLibraryResults(booksRes.data.docs);
    } catch (error) {
      console.error('OpenLibrary API Error:', error.message);
      throw new Error('Failed to search media');
    }
  }

  // Search for manga
  async searchAnilist(query) {
    try {
      const response = await this.anilistApi.post('', {
        query: `
          query ($search: String) {
            Page {
              media(search: $search, type: MANGA) {
                id
                title {
                  romaji
                }
                coverImage {
                  large
                }
              }
            }
          }
        `,
        variables: { search: query }
      });

      const results = response.data.data.Page.media;
      return this.formatAnilistResults(results);
    } catch (error) {
      console.error('Anilist API Error:', error.message);
      throw new Error('Failed to search media');
    }
  }
}

export default new MediaService();
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import MovieCard from '../components/MovieCard';

function Home() {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const TMDB_API_KEY = 'caf89c72858b353b35d1805bcbf97a0d';
  const TMDB_API_URL = 'https://api.themoviedb.org/3';

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        setError(null);

        const [trendingRes, popularRes, topRatedRes, upcomingRes] = await Promise.all([
          axios.get(`${TMDB_API_URL}/trending/movie/day`, {
            params: { api_key: TMDB_API_KEY }
          }),
          axios.get(`${TMDB_API_URL}/movie/popular`, {
            params: { api_key: TMDB_API_KEY }
          }),
          axios.get(`${TMDB_API_URL}/movie/top_rated`, {
            params: { api_key: TMDB_API_KEY }
          }),
          axios.get(`${TMDB_API_URL}/movie/upcoming`, {
            params: { api_key: TMDB_API_KEY }
          })
        ]);

        setTrendingMovies(trendingRes.data.results);
        setPopularMovies(popularRes.data.results);
        setTopRatedMovies(topRatedRes.data.results);
        setUpcomingMovies(upcomingRes.data.results);
      } catch (err) {
        console.error('Error fetching movies:', err);
        setError('Failed to fetch movies. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-yellow-500 text-black rounded-md hover:bg-yellow-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  const MovieRow = ({ title, movies }) => (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4 px-6">{title}</h2>
      <div className="relative group">
        <div className="flex overflow-x-auto space-x-4 px-6 py-2 scrollbar-hide">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="flex-none w-64 transform transition-transform duration-300 hover:scale-105"
              onMouseEnter={() => setSelectedMovie(movie)}
              onMouseLeave={() => setSelectedMovie(null)}
            >
              <Link to={`/movie/${movie.id}`}>
                <div className="relative aspect-[2/3] rounded-lg overflow-hidden">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-white font-semibold truncate">{movie.title}</h3>
                      <div className="flex items-center text-yellow-500 mt-1">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span>{movie.vote_average?.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      {trendingMovies[0] && (
        <div className="relative h-[80vh] w-full">
          <img
            src={`https://image.tmdb.org/t/p/original${trendingMovies[0].backdrop_path}`}
            alt={trendingMovies[0].title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{trendingMovies[0].title}</h1>
            <p className="text-lg md:text-xl text-gray-300 mb-6 max-w-2xl">
              {trendingMovies[0].overview}
            </p>
            <Link
              to={`/movie/${trendingMovies[0].id}`}
              className="inline-flex items-center px-6 py-3 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 transition-colors"
            >
              <svg
                className="w-6 h-6 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 0a10 10 0 100 20 10 10 0 000-20zm-2 14.5v-9l6 4.5-6 4.5z" />
              </svg>
              Watch Now
            </Link>
          </div>
        </div>
      )}

      {/* Movie Rows */}
      <div className="py-8">
        <MovieRow title="Trending Now" movies={trendingMovies} />
        <MovieRow title="Popular Movies" movies={popularMovies} />
        <MovieRow title="Top Rated" movies={topRatedMovies} />
        <MovieRow title="Coming Soon" movies={upcomingMovies} />
      </div>

      {/* Selected Movie Preview */}
      {selectedMovie && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-800 p-4 transform transition-transform duration-300 translate-y-0">
          <div className="max-w-7xl mx-auto flex items-center space-x-4">
            <img
              src={`https://image.tmdb.org/t/p/w200${selectedMovie.poster_path}`}
              alt={selectedMovie.title}
              className="w-20 h-30 object-cover rounded"
            />
            <div>
              <h3 className="text-white font-semibold">{selectedMovie.title}</h3>
              <p className="text-gray-400 text-sm">{selectedMovie.overview}</p>
            </div>
            <Link
              to={`/movie/${selectedMovie.id}`}
              className="ml-auto px-4 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-600 transition-colors"
            >
              View Details
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
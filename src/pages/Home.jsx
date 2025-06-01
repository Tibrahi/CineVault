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
    <div className="mb-12 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <div className="flex items-center space-x-2">
          <span className="text-gray-400 text-sm">Scroll to explore</span>
          <svg className="w-5 h-5 text-yellow-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
      <div className="relative">
        <div className="movie-scrollbar overflow-x-auto pb-6 flex space-x-6">
          {movies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
        {/* Gradient Fade Effect */}
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-gray-900 to-transparent pointer-events-none"></div>
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
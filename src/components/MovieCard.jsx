import { Link } from 'react-router-dom';

function MovieCard({ movie }) {
  return (
    <div className="flex-none w-64 transform transition-all duration-300 hover:scale-105 group">
      <Link to={`/movie/${movie.id}`}>
        <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-lg">
          {/* Movie Poster */}
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {/* Content Container */}
            <div className="absolute bottom-0 left-0 right-0 p-4 space-y-3">
              {/* Title and Rating */}
              <div className="space-y-2">
                <h3 className="text-white font-semibold text-lg line-clamp-2">
                  {movie.title}
                </h3>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center bg-yellow-500/20 px-2 py-1 rounded-full">
                    <svg
                      className="w-4 h-4 text-yellow-500 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-yellow-500 text-sm font-medium">
                      {movie.vote_average?.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-gray-300 text-sm">
                    {movie.release_date?.split('-')[0] || 'N/A'}
                  </span>
                </div>
              </div>

              {/* Overview */}
              <p className="text-gray-300 text-sm line-clamp-3">
                {movie.overview}
              </p>

              {/* View Details Button */}
              <div className="pt-2">
                <span className="inline-flex items-center text-yellow-500 text-sm font-medium hover:text-yellow-400 transition-colors">
                  View Details
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default MovieCard;
import { Link } from 'react-router-dom';

function MovieCard({ movie }) {
  return (
    <Link to={`/movie/${movie.id}`} className="block group">
      <div className="bg-gray-800/50 rounded-xl overflow-hidden shadow-lg group-hover:shadow-yellow-500/20 group-hover:scale-105 transition-all duration-300">
        <div className="relative">
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-full h-[350px] object-cover"
          />
          <div className="absolute top-2 right-2 bg-yellow-500 text-black font-bold px-2 py-1 rounded-md text-sm">
            {movie.rating}
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2 group-hover:text-yellow-500 transition-colors line-clamp-1">
            {movie.title}
          </h3>
          <div className="text-sm text-gray-400">
            <span>{movie.year}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default MovieCard;
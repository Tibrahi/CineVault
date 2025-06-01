import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Logo Component
const Logo = ({ className = "w-8 h-8" }) => (
  <div className={`relative ${className}`}>
    <div className="absolute inset-0 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg transform rotate-45"></div>
    <div className="absolute inset-0 flex items-center justify-center">
      <span className="text-white font-bold text-xl">CV</span>
    </div>
    <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-yellow-500 rounded-full"></div>
  </div>
);

function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState(null);
  const [streamingInfo, setStreamingInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [videoKey, setVideoKey] = useState(null);
  const [freeStreamingOptions, setFreeStreamingOptions] = useState([]);
  const [similarContent, setSimilarContent] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [latestMovies, setLatestMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [youtubeVideos, setYoutubeVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const TMDB_API_KEY = 'caf89c72858b353b35d1805bcbf97a0d';
  const TMDB_API_URL = 'https://api.themoviedb.org/3';
  const YOUTUBE_API_KEY = 'YOUR_YOUTUBE_API_KEY'; // You'll need to get this from Google Cloud Console
  const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3';

  // Free legal streaming services
  const FREE_STREAMING_SERVICES = {
    'Tubi': {
      url: 'https://tubitv.com',
      searchUrl: 'https://tubitv.com/search',
      color: 'bg-blue-600',
      category: 'Movies & TV',
      initial: 'T'
    },
    'Pluto TV': {
      url: 'https://pluto.tv',
      searchUrl: 'https://pluto.tv/en/search',
      color: 'bg-purple-600',
      category: 'Live TV',
      initial: 'P'
    },
    'Crackle': {
      url: 'https://www.crackle.com',
      searchUrl: 'https://www.crackle.com/browse',
      color: 'bg-red-600',
      category: 'Movies & TV',
      initial: 'C'
    },
    'Vudu': {
      url: 'https://www.vudu.com',
      searchUrl: 'https://www.vudu.com/content/browse',
      color: 'bg-green-600',
      category: 'Movies & TV',
      initial: 'V'
    },
    'Popcornflix': {
      url: 'https://www.popcornflix.com',
      searchUrl: 'https://www.popcornflix.com/browse',
      color: 'bg-yellow-600',
      category: 'Movies & TV',
      initial: 'P'
    },
    'Xumo': {
      url: 'https://www.xumo.tv',
      searchUrl: 'https://www.xumo.tv/search',
      color: 'bg-indigo-600',
      category: 'Live TV',
      initial: 'X'
    },
    'Plex': {
      url: 'https://www.plex.tv',
      searchUrl: 'https://www.plex.tv/search',
      color: 'bg-orange-600',
      category: 'Movies & TV',
      initial: 'P'
    },
    'Roku Channel': {
      url: 'https://therokuchannel.roku.com',
      searchUrl: 'https://therokuchannel.roku.com/browse',
      color: 'bg-pink-600',
      category: 'Movies & TV',
      initial: 'R'
    },
    'IMDb TV': {
      url: 'https://www.imdb.com/tv',
      searchUrl: 'https://www.imdb.com/find',
      color: 'bg-yellow-500',
      category: 'Movies & TV',
      initial: 'I'
    },
    'Peacock': {
      url: 'https://www.peacocktv.com',
      searchUrl: 'https://www.peacocktv.com/search',
      color: 'bg-blue-500',
      category: 'Movies & TV',
      initial: 'P'
    }
  };

  // Public domain movie sources
  const PUBLIC_DOMAIN_SOURCES = {
    'Internet Archive': {
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Internet_Archive_logo.svg/1200px-Internet_Archive_logo.svg.png',
      url: 'https://archive.org/details/movies'
    },
    'Public Domain Movies': {
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Public_Domain_Movies_logo.svg/1200px-Public_Domain_Movies_logo.svg.png',
      url: 'https://publicdomainmovies.net'
    }
  };

  // Free, no-signup-required streaming services
  const FREE_NO_SIGNUP_SERVICES = {
    'Tubi': {
      url: 'https://tubitv.com/search',
      searchUrl: 'https://tubitv.com/search',
      color: 'bg-blue-600',
      category: 'Movies & TV',
      initial: 'T',
      description: 'Free movies search and watch, no signup needed'
    },
    'Pluto TV': {
      url: 'https://pluto.tv/en/search',
      searchUrl: 'https://pluto.tv/en/search',
      color: 'bg-purple-600',
      category: 'Live TV',
      initial: 'P',
      description: 'Free TV search and watch, instant access'
    },
    'YouTube Movies': {
      url: 'https://www.youtube.com/results?search_query=',
      searchUrl: 'https://www.youtube.com/results?search_query=',
      color: 'bg-red-600',
      category: 'Movies & TV',
      initial: 'Y',
      description: 'Free movies search and watch, no account needed'
    },
    'Vudu': {
      url: 'https://www.vudu.com/content/browse',
      searchUrl: 'https://www.vudu.com/content/browse',
      color: 'bg-green-600',
      category: 'Movies & TV',
      initial: 'V',
      description: 'Free movies search, direct streaming'
    },
    'Showmax': {
      url: 'https://www.showmax.com/eng/browse',
      searchUrl: 'https://www.showmax.com/eng/browse',
      color: 'bg-yellow-600',
      category: 'Movies & TV',
      initial: 'S',
      description: 'Free movies search, instant watch'
    },
    'IROKOtv': {
      url: 'https://irokotv.com/search',
      searchUrl: 'https://irokotv.com/search',
      color: 'bg-orange-600',
      category: 'Movies & TV',
      initial: 'I',
      description: 'Free movies search, direct streaming'
    },
    'Afrostream': {
      url: 'https://afrostream.tv/search',
      searchUrl: 'https://afrostream.tv/search',
      color: 'bg-pink-600',
      category: 'Movies & TV',
      initial: 'A',
      description: 'Free movies search, instant access'
    },
    'Filmzie': {
      url: 'https://filmzie.com/search',
      searchUrl: 'https://filmzie.com/search',
      color: 'bg-indigo-600',
      category: 'Movies & TV',
      initial: 'F',
      description: 'Free movies search and watch, no signup'
    },
    'Popcornflix': {
      url: 'https://www.popcornflix.com/browse',
      searchUrl: 'https://www.popcornflix.com/browse',
      color: 'bg-teal-600',
      category: 'Movies & TV',
      initial: 'P',
      description: 'Free movies search, direct streaming'
    }
  };

  // Fetch latest and upcoming movies
  useEffect(() => {
    const fetchLatestMovies = async () => {
      try {
        const [latestResponse, upcomingResponse] = await Promise.all([
          axios.get(`${TMDB_API_URL}/movie/now_playing`, {
            params: {
              api_key: TMDB_API_KEY,
              language: 'en-US',
              page: 1
            }
          }),
          axios.get(`${TMDB_API_URL}/movie/upcoming`, {
            params: {
              api_key: TMDB_API_KEY,
              language: 'en-US',
              page: 1
            }
          })
        ]);

        setLatestMovies(latestResponse.data.results);
        setUpcomingMovies(upcomingResponse.data.results);
      } catch (err) {
        console.error('Error fetching latest movies:', err);
      }
    };

    fetchLatestMovies();
  }, []);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!id) {
          throw new Error('No movie ID provided');
        }

        // First determine if it's a movie or TV show
        const movieResponse = await axios.get(`${TMDB_API_URL}/movie/${id}`, {
          params: {
            api_key: TMDB_API_KEY,
            append_to_response: 'videos,credits,watch/providers,similar,recommendations'
          }
        }).catch(() => null);

        const tvResponse = !movieResponse ? await axios.get(`${TMDB_API_URL}/tv/${id}`, {
          params: {
            api_key: TMDB_API_KEY,
            append_to_response: 'videos,credits,watch/providers,similar,recommendations'
          }
        }) : null;

        if (!movieResponse && !tvResponse) {
          throw new Error('Content not found');
        }

        const response = movieResponse || tvResponse;
        const isMovie = !!movieResponse;
        const data = response.data;

        if (!data) {
          throw new Error('Invalid response from server');
        }

        // Get video key from the first available video
        const videos = data.videos?.results || [];
        const trailer = videos.find(v => v.type === 'Trailer') || videos[0];
        if (trailer) {
          setVideoKey(trailer.key);
        }

        // Check if movie is in public domain (example: movies before 1927)
        const releaseYear = parseInt((isMovie ? data.release_date : data.first_air_date)?.substring(0, 4) || '0');
        const isPublicDomain = releaseYear < 1927;

        setContent({
          id: data.id,
          title: isMovie ? data.title : data.name,
          overview: data.overview,
          poster: data.poster_path ? 
            `https://image.tmdb.org/t/p/original${data.poster_path}` :
            'https://via.placeholder.com/500x750',
          backdrop: data.backdrop_path ?
            `https://image.tmdb.org/t/p/original${data.backdrop_path}` : null,
          rating: data.vote_average?.toFixed(1) || 'N/A',
          year: (isMovie ? data.release_date : data.first_air_date)?.substring(0, 4) || 'N/A',
          runtime: isMovie ? 
            `${Math.floor(data.runtime / 60)}h ${data.runtime % 60}m` :
            `${data.number_of_seasons} Season${data.number_of_seasons > 1 ? 's' : ''}, ${data.number_of_episodes} Episodes`,
          genres: data.genres?.map(g => g.name) || [],
          director: isMovie ?
            data.credits?.crew?.find(c => c.job === 'Director')?.name :
            data.created_by?.map(c => c.name).join(', ') || 'N/A',
          cast: data.credits?.cast?.slice(0, 5).map(c => c.name) || [],
          providers: data['watch/providers']?.results?.US || {},
          type: isMovie ? 'movie' : 'tv',
          isPublicDomain,
          budget: isMovie ? data.budget : null,
          revenue: isMovie ? data.revenue : null,
          status: data.status,
          tagline: data.tagline,
          videos: videos,
          similar: data.similar?.results || [],
          recommendations: data.recommendations?.results || []
        });

        // Format streaming providers
        const providers = data['watch/providers']?.results?.US || {};
        setStreamingInfo({
          stream: providers.flatrate || [],
          rent: providers.rent || [],
          buy: providers.buy || []
        });

        // Set free streaming options
        setFreeStreamingOptions([
          ...Object.entries(FREE_STREAMING_SERVICES).map(([name, info]) => ({
            name,
            url: info.url
          })),
          ...(isPublicDomain ? Object.entries(PUBLIC_DOMAIN_SOURCES).map(([name, info]) => ({
            name,
            logo: info.logo,
            url: info.url,
            isPublicDomain: true
          })) : [])
        ]);

        // Set similar content
        setSimilarContent(data.similar?.results || []);

      } catch (err) {
        console.error('Error fetching content:', err);
        setError(err.message || 'Failed to fetch content details');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  useEffect(() => {
    const fetchYoutubeVideos = async () => {
      if (!content?.title) return;
      
      try {
        const response = await axios.get(`${YOUTUBE_API_URL}/search`, {
          params: {
            part: 'snippet',
            maxResults: 5,
            q: `${content.title} official trailer OR behind the scenes OR interview`,
            type: 'video',
            key: YOUTUBE_API_KEY
          }
        });

        setYoutubeVideos(response.data.items);
      } catch (err) {
        console.error('Error fetching YouTube videos:', err);
      }
    };

    fetchYoutubeVideos();
  }, [content?.title, YOUTUBE_API_KEY]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-yellow-500 text-black rounded-md hover:bg-yellow-600 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 mb-4">No content found</p>
        <button 
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-yellow-500 text-black rounded-md hover:bg-yellow-600 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Logo */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Logo />
            <span className="text-white font-bold text-xl">CineVault</span>
          </div>
          <button
            onClick={() => navigate('/')}
            className="text-gray-300 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-[60vh] w-full mt-16">
        {content.backdrop && (
          <img 
            src={content.backdrop}
            alt={content.title}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h1 className="text-5xl font-bold mb-2">{content.title}</h1>
          {content.tagline && (
            <p className="text-xl text-gray-300 italic mb-4">{content.tagline}</p>
          )}
          <div className="flex items-center space-x-4 text-gray-300">
            <span>{content.year}</span>
            <span>{content.runtime}</span>
            <span className="flex items-center">
              <svg
                className="w-5 h-5 text-yellow-500 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {content.rating}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6">
        <div className="md:col-span-2">
          {/* Tabs */}
          <div className="flex space-x-4 mb-6 border-b border-gray-700">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-2 px-4 ${activeTab === 'overview' ? 'border-b-2 border-yellow-500 text-yellow-500' : 'text-gray-400'}`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('videos')}
              className={`pb-2 px-4 ${activeTab === 'videos' ? 'border-b-2 border-yellow-500 text-yellow-500' : 'text-gray-400'}`}
            >
              Videos
            </button>
            <button
              onClick={() => setActiveTab('similar')}
              className={`pb-2 px-4 ${activeTab === 'similar' ? 'border-b-2 border-yellow-500 text-yellow-500' : 'text-gray-400'}`}
            >
              Similar
            </button>
            <button
              onClick={() => setActiveTab('latest')}
              className={`pb-2 px-4 ${activeTab === 'latest' ? 'border-b-2 border-yellow-500 text-yellow-500' : 'text-gray-400'}`}
            >
              Latest
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <p className="text-gray-300 text-lg">{content.overview}</p>

              {/* Free Streaming Options */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Free Legal Streaming Options</h3>
                
                {/* No Signup Required Section */}
                <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-medium">Search & Watch {content.title} for Free</h4>
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">Direct Search & Watch</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {Object.entries(FREE_NO_SIGNUP_SERVICES).map(([name, info]) => (
                      <a
                        key={name}
                        href={`${info.searchUrl}${encodeURIComponent(content.title)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors group"
                      >
                        <div className={`w-10 h-10 rounded-full ${info.color} flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform duration-300`}>
                          {info.initial}
                        </div>
                        <div className="flex-1">
                          <span className="block font-medium">{name}</span>
                          <span className="text-xs text-gray-400">{info.description}</span>
                        </div>
                        <svg className="w-5 h-5 text-gray-400 group-hover:text-yellow-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    ))}
                  </div>
                </div>

                {/* All Streaming Services */}
                <div>
                  <h4 className="text-lg font-medium mb-3">All Free Streaming Services</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {Object.entries(FREE_STREAMING_SERVICES).map(([name, info]) => (
                      <a
                        key={name}
                        href={info.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors group"
                      >
                        <div className="relative w-16 h-16 mb-2">
                          <div className={`w-full h-full rounded-full ${info.color} flex items-center justify-center text-white text-2xl font-bold group-hover:scale-110 transition-transform duration-300`}>
                            {info.initial}
                          </div>
                          <div className="absolute inset-0 bg-yellow-500 opacity-0 group-hover:opacity-10 transition-opacity rounded-full"></div>
                        </div>
                        <span className="text-sm text-center font-medium">{name}</span>
                        <span className="text-xs text-gray-400 mt-1">{info.category}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Where to Watch */}
              {streamingInfo && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Where to Watch</h3>
                  
                  {streamingInfo.stream.length > 0 && (
                    <div>
                      <h4 className="text-lg text-gray-400 mb-2">Stream</h4>
                      <div className="flex flex-wrap gap-2">
                        {streamingInfo.stream.map(provider => (
                          <div key={provider.provider_id} className="flex items-center bg-gray-800 rounded-full px-3 py-1">
                            <img 
                              src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                              alt={provider.provider_name}
                              className="w-6 h-6 rounded-full mr-2"
                            />
                            <span>{provider.provider_name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {streamingInfo.rent.length > 0 && (
                    <div>
                      <h4 className="text-lg text-gray-400 mb-2">Rent</h4>
                      <div className="flex flex-wrap gap-2">
                        {streamingInfo.rent.map(provider => (
                          <div key={provider.provider_id} className="flex items-center bg-gray-800 rounded-full px-3 py-1">
                            <img 
                              src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                              alt={provider.provider_name}
                              className="w-6 h-6 rounded-full mr-2"
                            />
                            <span>{provider.provider_name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {streamingInfo.buy.length > 0 && (
                    <div>
                      <h4 className="text-lg text-gray-400 mb-2">Buy</h4>
                      <div className="flex flex-wrap gap-2">
                        {streamingInfo.buy.map(provider => (
                          <div key={provider.provider_id} className="flex items-center bg-gray-800 rounded-full px-3 py-1">
                            <img 
                              src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                              alt={provider.provider_name}
                              className="w-6 h-6 rounded-full mr-2"
                            />
                            <span>{provider.provider_name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Additional Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    {content.type === 'movie' ? 'Director' : 'Created By'}
                  </h3>
                  <p>{content.director}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Cast</h3>
                  <p>{content.cast.join(', ')}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Genres</h3>
                  <div className="flex flex-wrap gap-2">
                    {content.genres.map((genre, index) => (
                      <span key={index} className="bg-gray-800 rounded-full px-3 py-1 text-sm">
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>

                {content.type === 'movie' && (
                  <>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Budget</h3>
                      <p>{content.budget ? `$${content.budget.toLocaleString()}` : 'N/A'}</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Revenue</h3>
                      <p>{content.revenue ? `$${content.revenue.toLocaleString()}` : 'N/A'}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {activeTab === 'videos' && (
            <div className="space-y-8">
              {/* Official Trailers */}
              {content?.videos?.results?.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">Official Trailers & Clips</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {content.videos.results.map((video) => (
                      <div key={video.key} className="relative aspect-video rounded-lg overflow-hidden">
                        <iframe
                          src={`https://www.youtube.com/embed/${video.key}`}
                          title={video.name}
                          className="absolute inset-0 w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Free Legal Streaming Options */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Free Legal Streaming Options</h3>
                  
                  {/* Movies & TV Section */}
                  <div className="mb-6">
                    <h4 className="text-lg text-gray-400 mb-3">Movies & TV Shows</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {Object.entries(FREE_STREAMING_SERVICES)
                        .filter(([_, info]) => info.category === 'Movies & TV')
                        .map(([name, info]) => (
                          <a
                            key={name}
                            href={info.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors group"
                          >
                            <div className="relative w-16 h-16 mb-2">
                              <div className={`w-full h-full rounded-full ${info.color} flex items-center justify-center text-white text-2xl font-bold group-hover:scale-110 transition-transform duration-300`}>
                                {info.initial}
                              </div>
                              <div className="absolute inset-0 bg-yellow-500 opacity-0 group-hover:opacity-10 transition-opacity rounded-full"></div>
                            </div>
                            <span className="text-sm text-center font-medium">{name}</span>
                            <span className="text-xs text-gray-400 mt-1">Free Streaming</span>
                          </a>
                        ))}
                    </div>
                  </div>

                  {/* Live TV Section */}
                  <div>
                    <h4 className="text-lg text-gray-400 mb-3">Live TV</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {Object.entries(FREE_STREAMING_SERVICES)
                        .filter(([_, info]) => info.category === 'Live TV')
                        .map(([name, info]) => (
                          <a
                            key={name}
                            href={info.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors group"
                          >
                            <div className="relative w-16 h-16 mb-2">
                              <div className={`w-full h-full rounded-full ${info.color} flex items-center justify-center text-white text-2xl font-bold group-hover:scale-110 transition-transform duration-300`}>
                                {info.initial}
                              </div>
                              <div className="absolute inset-0 bg-yellow-500 opacity-0 group-hover:opacity-10 transition-opacity rounded-full"></div>
                            </div>
                            <span className="text-sm text-center font-medium">{name}</span>
                            <span className="text-xs text-gray-400 mt-1">Live TV</span>
                          </a>
                        ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Public Domain Movies */}
              {content?.isPublicDomain && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">Public Domain Sources</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {Object.entries(PUBLIC_DOMAIN_SOURCES).map(([name, info]) => (
                      <a
                        key={name}
                        href={info.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        <img
                          src={info.logo}
                          alt={name}
                          className="w-16 h-16 object-contain mb-2"
                        />
                        <span className="text-sm text-center">{name}</span>
                        <span className="text-xs text-yellow-500 mt-1">Public Domain</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'similar' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {similarContent.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => navigate(`/movie/${item.id}`)}
                    className="cursor-pointer group"
                  >
                    <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-2">
                      <img
                        src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                        alt={item.title || item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity"></div>
                    </div>
                    <h3 className="font-semibold truncate">{item.title || item.name}</h3>
                    <p className="text-sm text-gray-400">
                      {item.release_date?.substring(0, 4) || item.first_air_date?.substring(0, 4)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'latest' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4">Now Playing</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {latestMovies.map((movie) => (
                    <div
                      key={movie.id}
                      onClick={() => navigate(`/movie/${movie.id}`)}
                      className="cursor-pointer group"
                    >
                      <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-2">
                        <img
                          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                          alt={movie.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity"></div>
                      </div>
                      <h3 className="font-semibold truncate">{movie.title}</h3>
                      <p className="text-sm text-gray-400">
                        {movie.release_date?.substring(0, 4)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">Coming Soon</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {upcomingMovies.map((movie) => (
                    <div
                      key={movie.id}
                      onClick={() => navigate(`/movie/${movie.id}`)}
                      className="cursor-pointer group"
                    >
                      <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-2">
                        <img
                          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                          alt={movie.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity"></div>
                      </div>
                      <h3 className="font-semibold truncate">{movie.title}</h3>
                      <p className="text-sm text-gray-400">
                        {movie.release_date?.substring(0, 4)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="md:col-span-1">
          <div className="sticky top-8">
            <img
              src={content.poster}
              alt={content.title}
              className="w-full rounded-xl shadow-lg"
            />
            {videoKey && (
              <button
                onClick={() => setIsVideoPlaying(true)}
                className="w-full mt-4 px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 transition-colors flex items-center justify-center"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 0a10 10 0 100 20 10 10 0 000-20zm-2 14.5v-9l6 4.5-6 4.5z" />
                </svg>
                Play Trailer
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {isVideoPlaying && videoKey && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl aspect-video">
            <button
              onClick={() => setIsVideoPlaying(false)}
              className="absolute -top-10 right-0 text-white hover:text-yellow-500 transition-colors"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <iframe
              src={`https://www.youtube.com/embed/${videoKey}?autoplay=1`}
              title={content.title}
              className="w-full h-full rounded-lg"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
}

export default MovieDetail;
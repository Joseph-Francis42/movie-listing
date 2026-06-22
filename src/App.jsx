import React, { useState, useEffect } from 'react';
import MovieCard from './components/MovieCard';
import MovieDetailsModal from './components/MovieDetailsModal';

const apiKey = 'b6003d8a'; // Hardcoded OMDb key

const App = () => {
  
  // Search & Filtering State
  const [searchTerm, setSearchTerm] = useState('');
  const [query, setQuery] = useState('Batman'); // Default query on mount
  const [typeFilter, setTypeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  
  // UI List States
  const [movies, setMovies] = useState([]);
  const [watchlist, setWatchlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('omdb_watchlist')) || [];
    } catch {
      return [];
    }
  });

  // App UI State Flags
  const [activeTab, setActiveTab] = useState('search'); // 'search' | 'watchlist'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Modal states
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Sync Watchlist to LocalStorage
  useEffect(() => {
    localStorage.setItem('omdb_watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  // Fetch Movies
  const fetchMovies = async (searchQuery, page, filter) => {
    if (!apiKey) return;
    
    setLoading(true);
    setError('');
    
    try {
      let url = `https://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(searchQuery)}&page=${page}`;
      if (filter !== 'all') {
        url += `&type=${filter}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (data.Response === 'True') {
        setMovies(data.Search || []);
        setTotalResults(parseInt(data.totalResults, 10) || 0);
      } else {
        setMovies([]);
        setTotalResults(0);
        setError(data.Error || 'No results found.');
      }
    } catch (err) {
      setError('A connection error occurred. Please try again.');
      setMovies([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  };

  // Run Search on query / filter / page changes
  useEffect(() => {
    if (apiKey) {
      fetchMovies(query, currentPage, typeFilter);
    }
  }, [apiKey, query, currentPage, typeFilter]);

  // Handle Search Submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    
    setQuery(searchTerm.trim());
    setCurrentPage(1);
    setActiveTab('search');
  };

  // Reset to default Search
  const handleLogoClick = () => {
    setSearchTerm('');
    setQuery('Batman');
    setCurrentPage(1);
    setTypeFilter('all');
    setActiveTab('search');
  };

  // Toggle Watchlist / Favorite status
  const handleToggleWatchlist = (movie) => {
    setWatchlist((prevWatchlist) => {
      const isAlreadyIn = prevWatchlist.some((item) => item.imdbID === movie.imdbID);
      if (isAlreadyIn) {
        return prevWatchlist.filter((item) => item.imdbID !== movie.imdbID);
      } else {
        return [...prevWatchlist, movie];
      }
    });
  };

  // Check if movie in watchlist
  const isInWatchlist = (imdbID) => watchlist.some((item) => item.imdbID === imdbID);

  // Open Movie Details
  const handleSelectMovie = (imdbID) => {
    setSelectedMovieId(imdbID);
    setIsDetailsOpen(true);
  };

  // Pagination Handlers
  const totalPages = Math.ceil(totalResults / 10);
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="app-container">
      {/* Header / Navbar */}
      <header className="app-header">
        <div className="logo-container" onClick={handleLogoClick}>
          <span className="logo-icon">🎬</span>
          <h1 className="logo-text">MovieLand</h1>
        </div>

        <div className="nav-actions">
          <button 
            className={`btn btn-watchlist-toggle ${activeTab === 'watchlist' ? 'active' : ''}`}
            onClick={() => setActiveTab(activeTab === 'watchlist' ? 'search' : 'watchlist')}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
            Watchlist ({watchlist.length})
          </button>
        </div>
      </header>

      {activeTab === 'watchlist' ? (
        // Watchlist Tab View
        <div>
          <div className="results-header">
            <h2 className="results-title">My Watchlist</h2>
            <span className="results-count">
              {watchlist.length} {watchlist.length === 1 ? 'item' : 'items'} saved
            </span>
          </div>

          {watchlist.length > 0 ? (
            <div className="movies-grid">
              {watchlist.map((movie) => (
                <MovieCard
                  key={movie.imdbID}
                  movie={movie}
                  onSelect={handleSelectMovie}
                  inWatchlist={true}
                  onToggleWatchlist={handleToggleWatchlist}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">⭐</div>
              <h3 className="empty-state-title">Your watchlist is empty</h3>
              <p className="empty-state-desc">
                Go back to search, hover over movie posters, and click the star to build your watchlist.
              </p>
              <button 
                className="btn btn-primary" 
                onClick={() => setActiveTab('search')}
                style={{ marginTop: '1.5rem' }}
              >
                Explore Movies
              </button>
            </div>
          )}
        </div>
      ) : (
        // Search & Explore Tab View
        <div>
          {/* Search Controls Section */}
          <section className="search-controls">
            <form onSubmit={handleSearchSubmit} className="search-input-wrapper">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for movies, series, or episodes..."
              />
              <button type="submit" className="search-btn" aria-label="Search button">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </button>
            </form>

            <div className="filter-tabs">
              <button
                className={`filter-tab ${typeFilter === 'all' ? 'active' : ''}`}
                onClick={() => { setTypeFilter('all'); setCurrentPage(1); }}
              >
                All Categories
              </button>
              <button
                className={`filter-tab ${typeFilter === 'movie' ? 'active' : ''}`}
                onClick={() => { setTypeFilter('movie'); setCurrentPage(1); }}
              >
                Movies
              </button>
              <button
                className={`filter-tab ${typeFilter === 'series' ? 'active' : ''}`}
                onClick={() => { setTypeFilter('series'); setCurrentPage(1); }}
              >
                TV Series
              </button>
              <button
                className={`filter-tab ${typeFilter === 'episode' ? 'active' : ''}`}
                onClick={() => { setTypeFilter('episode'); setCurrentPage(1); }}
              >
                Episodes
              </button>
            </div>
          </section>

          {/* Results Area */}
          {loading && (
            <div className="loader-container">
              <div className="spinner"></div>
              <span className="loader-text">Searching the library...</span>
            </div>
          )}

          {error && !loading && (
            <div className="empty-state">
              <div className="empty-state-icon">🔍</div>
              <h3 className="empty-state-title">No matches found</h3>
              <p className="empty-state-desc">
                We couldn't find anything matching "{query}" under the selected category. Try checking spelling or search other terms.
              </p>
            </div>
          )}

          {!loading && !error && movies.length > 0 && (
            <>
              <div className="results-header">
                <h2 className="results-title">Search Results for "{query}"</h2>
                <span className="results-count">Found {totalResults} matches</span>
              </div>

              <div className="movies-grid">
                {movies.map((movie) => (
                  <MovieCard
                    key={movie.imdbID}
                    movie={movie}
                    onSelect={handleSelectMovie}
                    inWatchlist={isInWatchlist(movie.imdbID)}
                    onToggleWatchlist={handleToggleWatchlist}
                  />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button 
                    className="btn" 
                    onClick={handlePrevPage} 
                    disabled={currentPage === 1}
                    style={{ opacity: currentPage === 1 ? 0.4 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
                  >
                    &larr; Previous
                  </button>
                  <span className="pagination-info">
                    Page <span>{currentPage}</span> of <span>{totalPages}</span>
                  </span>
                  <button 
                    className="btn" 
                    onClick={handleNextPage} 
                    disabled={currentPage === totalPages}
                    style={{ opacity: currentPage === totalPages ? 0.4 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
                  >
                    Next &rarr;
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}



      {/* Movie Details Modal */}
      <MovieDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedMovieId(null);
        }}
        movieId={selectedMovieId}
        apiKey={apiKey}
      />
    </div>
  );
};

export default App;

import React from 'react';

const MovieCard = ({ movie, onSelect, inWatchlist, onToggleWatchlist }) => {
  const { Title, Year, Poster, Type, imdbID } = movie;
  const isPosterAvailable = Poster && Poster !== 'N/A';
  
  // Format Type for display (capitalize first letter)
  const displayType = Type ? Type.charAt(0).toUpperCase() + Type.slice(1) : 'Unknown';

  const handleWatchlistClick = (e) => {
    e.stopPropagation(); // Prevent opening movie details when bookmarking
    onToggleWatchlist(movie);
  };

  return (
    <div className="movie-card" onClick={() => onSelect(imdbID)}>
      <div className="movie-poster-wrapper">
        <img
          src={isPosterAvailable ? Poster : 'https://via.placeholder.com/400x600?text=No+Poster+Available'}
          alt={Title}
          className="movie-poster"
          loading="lazy"
        />
        <div className="movie-overlay-hover">
          <button
            className={`watchlist-btn-overlay ${inWatchlist ? 'in-watchlist' : ''}`}
            onClick={handleWatchlistClick}
            title={inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
            aria-label={inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
          >
            {inWatchlist ? (
              // Filled star/bookmark icon
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            ) : (
              // Outline star/bookmark icon
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            )}
          </button>
          
          <span className="movie-year-badge">{Year}</span>
        </div>
      </div>

      <div className="movie-info">
        <div className="movie-meta">
          <span className="movie-type">{displayType}</span>
        </div>
        <h3 className="movie-title" title={Title}>{Title}</h3>
      </div>
    </div>
  );
};

export default MovieCard;

import React, { useState, useEffect } from 'react';

const MovieDetailsModal = ({ movieId, isOpen, onClose, apiKey }) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen || !movieId || !apiKey) return;

    const fetchDetails = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${movieId}&plot=full`);
        const data = await response.json();
        if (data.Response === 'True') {
          setDetails(data);
        } else {
          setError(data.Error || 'Failed to fetch details.');
        }
      } catch (err) {
        setError('A network error occurred. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [movieId, isOpen, apiKey]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content-wrapper" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close details">
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {loading && (
          <div className="loader-container">
            <div className="spinner"></div>
            <span className="loader-text">Fetching details...</span>
          </div>
        )}

        {error && !loading && (
          <div className="empty-state">
            <div className="empty-state-icon">⚠️</div>
            <h3 className="empty-state-title">Error Loading Details</h3>
            <p className="empty-state-desc">{error}</p>
          </div>
        )}

        {details && !loading && !error && (
          <div className="movie-details-grid">
            <div className="details-poster-wrapper">
              <img
                src={details.Poster !== 'N/A' ? details.Poster : 'https://via.placeholder.com/400x600?text=No+Poster+Available'}
                alt={details.Title}
                className="details-poster"
              />
            </div>
            <div className="details-info-section">
              <div className="details-header">
                <h2 className="details-title">{details.Title}</h2>
                <div className="details-meta-row">
                  <span className="badge-outline">{details.Year}</span>
                  <span className="badge-outline">{details.Rated}</span>
                  <span className="badge-outline">{details.Runtime}</span>
                  {details.imdbRating !== 'N/A' && (
                    <span className="rating-badge">
                      <svg viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                      {details.imdbRating}/10
                    </span>
                  )}
                </div>
              </div>

              {details.Genre !== 'N/A' && (
                <div className="filter-tabs" style={{ margin: 0 }}>
                  {details.Genre.split(',').map((genre) => (
                    <span key={genre.trim()} className="filter-tab active" style={{ cursor: 'default' }}>
                      {genre.trim()}
                    </span>
                  ))}
                </div>
              )}

              {details.Plot !== 'N/A' && (
                <p className="details-plot">{details.Plot}</p>
              )}

              <div className="details-metadata-table">
                {details.Director !== 'N/A' && (
                  <div className="details-row">
                    <span className="details-label">Director</span>
                    <span className="details-value">{details.Director}</span>
                  </div>
                )}
                {details.Writer !== 'N/A' && (
                  <div className="details-row">
                    <span className="details-label">Writer</span>
                    <span className="details-value">{details.Writer}</span>
                  </div>
                )}
                {details.Actors !== 'N/A' && (
                  <div className="details-row">
                    <span className="details-label">Cast</span>
                    <span className="details-value">{details.Actors}</span>
                  </div>
                )}
                {details.Released !== 'N/A' && (
                  <div className="details-row">
                    <span className="details-label">Release</span>
                    <span className="details-value">{details.Released}</span>
                  </div>
                )}
                {details.BoxOffice !== 'N/A' && details.BoxOffice && (
                  <div className="details-row">
                    <span className="details-label">Box Office</span>
                    <span className="details-value">{details.BoxOffice}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetailsModal;

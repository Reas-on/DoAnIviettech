import React from 'react';
import PropTypes from 'prop-types';

const Rating = ({ value, text, color }) => {
  const stars = [];
  for (let i = 0; i < 5; i++) {
    if (value >= i + 1) {
      stars.push(<span key={i} style={{ color }}>&#9733;</span>);
    } else if (value >= i + 0.5) {
      stars.push(<span key={i} style={{ color }}>&#9734;</span>);
    } else {
      stars.push(<span key={i} style={{ color }}>&#9734;</span>);
    }
  }

  return (
    <div className="rating">
      {stars}
      <span>{text && text}</span>
    </div>
  );
};

Rating.defaultProps = {
  color: '#f8e825',
};

Rating.propTypes = {
  value: PropTypes.number.isRequired,
  text: PropTypes.string,
  color: PropTypes.string,
};

export default Rating;

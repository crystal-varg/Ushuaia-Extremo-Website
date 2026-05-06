import PropTypes from 'prop-types';
import React from 'react';

export function Price({ regular, special }) {
  return (
    <h4 className="product-single-price monumental font-bold text-2xl">
      {special.value === regular.value && (
        <div>
          <span className="sale-price">${regular.value}</span>
        </div>
      )}
      {special.value < regular.value && (
        <div>
          <span className="sale-price">{special.text}</span>{' '}
          <span className="regular-price">{regular.text}</span>
        </div>
      )}
    </h4>
  );
}

Price.propTypes = {
  regular: PropTypes.shape({
    value: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired
  }).isRequired,
  special: PropTypes.shape({
    value: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired
  }).isRequired
};

import React from 'react';
import PropTypes from 'prop-types';

function ProductNoThumbnail({ width, height }) {
  return (
    <svg
      width={width || 100}
      height={height || 100}
      viewBox="0 0 251 276"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      
    </svg>
  );
}

ProductNoThumbnail.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number
};

ProductNoThumbnail.defaultProps = {
  width: 100,
  height: 100
};

export default ProductNoThumbnail;

import PropTypes from "prop-types";
import React from "react";

function Price({ regular, special, desde }) {
  return (
    <div className="product-price-listing">
      {regular.value === special.value && (
        <div>
          <p className="monumental mb-4">
            <span className="text-[#737373] text-base font-bold mt-auto">
              DESDE
            </span>{" "}
            <span className="text-xl font-bold">${regular.value.toLocaleString()}</span>
          </p>
          {/* <span className="sale-price font-bold monumental text-sm text-[rgb(0,0,0,.6)]">
            {desde ? "Desde " : ""}
            ${regular.value}
          </span> */}
        </div>
      )}
      {special.value < regular.value && (
        <div>
          <span className="sale-price text-critical font-bold monumental">
            {special.text}
          </span>{" "}
          <span className="regular-price font-bold monumental">
            {regular.text}
          </span>
        </div>
      )}
    </div>
  );
}

Price.propTypes = {
  regular: PropTypes.shape({
    value: PropTypes.number,
    text: PropTypes.string,
  }).isRequired,
  special: PropTypes.shape({
    value: PropTypes.number,
    text: PropTypes.string,
  }).isRequired,
};

export { Price };

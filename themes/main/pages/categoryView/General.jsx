/* eslint-disable react/no-danger */
import React, { useEffect } from "react";
import PropTypes from "prop-types";
import "./General.scss";
import Editor from "@evershop/evershop/src/components/common/Editor";

export default function CategoryInfo({
  category: { name, description, image },
}) {
  const [promos, setPromos] = React.useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const promosValue = urlParams.get("promos");
    if (promosValue === "1") {
      setPromos(true);
    }
  }, []);
  return (
    <div className="page-width">
      <div className="mb-4 md:mb-8 category__general">
        {image && (
          <img src={image.url} alt={name} className="category__image" />
        )}
        <div className="category__info prose prose-base max-w-none">
          <h1 className="category__name monumental font-light max-sm:text-2xl">
            {name} {promos ? "- Promos" : ""}
          </h1>
          <div className="category__description">
            <Editor rows={description} />
          </div>
        </div>
      </div>
    </div>
  );
}

CategoryInfo.propTypes = {
  category: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        size: PropTypes.number.isRequired,
        columns: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.string.isRequired,
            size: PropTypes.number.isRequired,
            // eslint-disable-next-line react/forbid-prop-types
            data: PropTypes.object.isRequired,
          }),
        ),
      }),
    ),
    image: PropTypes.shape({
      url: PropTypes.string.isRequired,
    }),
  }).isRequired,
};

export const layout = {
  areaId: "content",
  sortOrder: 5,
};

export const query = `
  query Query {
    category(id: getContextValue('categoryId')) {
      name
      description
      image {
        alt
        url
      }
    }
}`;

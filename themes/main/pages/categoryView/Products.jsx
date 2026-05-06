import PropTypes from "prop-types";
import React, { useEffect } from "react";
import ProductList from "../../components/Product/list/List";
import { _ } from "@evershop/evershop/src/lib/locale/translate";

export default function Products({
  products: {
    showProducts,
    products: { items },
  },
}) {
  if (!showProducts) {
    return null;
  }

  const [promos, setPromos] = React.useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const promosValue = urlParams.get("promos");
    if (promosValue === "1") {
      setPromos(true);
    }
  }, []);

  items = promos
    ? items.filter((item) => item.featuredPackage === true)
    : items;

  return (
    <div>
      <ProductList products={items} countPerRow={3} />
    </div>
  );
}

Products.propTypes = {
  products: PropTypes.shape({
    showProducts: PropTypes.number,
    products: PropTypes.shape({
      items: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string,
          productId: PropTypes.number,
          url: PropTypes.string,
          price: PropTypes.shape({
            regular: PropTypes.shape({
              value: PropTypes.number,
              text: PropTypes.string,
            }),
            special: PropTypes.shape({
              value: PropTypes.number,
              text: PropTypes.string,
            }),
          }),
          image: PropTypes.shape({
            alt: PropTypes.string,
            listing: PropTypes.string,
          }),
        }),
      ),
    }),
  }),
};

Products.defaultProps = {
  products: {
    showProducts: 1,
    products: {
      items: [],
    },
  },
};

export const layout = {
  areaId: "rightColumn",
  sortOrder: 25,
};

export const query = `
  query Query($filters: [FilterInput]) {
    products: category(id: getContextValue('categoryId')) {
      showProducts
      products(filters: $filters) {
        items {
          uuid
          featuredPackage
          ...Product
        }
      }
    }
  }`;

export const fragments = `
  fragment Product on Product {
    productId
    name
    sku
    category {
      path {
        name
      }
    }
    price {
      regular {
        value
        text
      }
      special {
        value
        text
      }
    }
    image {
      alt
      url: listing
    }
    url
  }
`;

export const variables = `
{
  filters: getContextValue('filtersFromUrl')
}`;

import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { Name } from "./item/Name";
import { Thumbnail } from "./item/Thumbnail";
import { Price } from "./item/Price";
import Area from "@components/common/Area";
import { get } from "@evershop/evershop/src/lib/util/get";
import { _ } from "@evershop/evershop/src/lib/locale/translate";

export default function ProductList({ products = [], countPerRow = 3 }) {
  const [excursion, setExcursion] = useState(false);

  useEffect(() => {
    if (window.location.pathname.startsWith("/excursion")) setExcursion(true);
  }, []);

  if (products.length === 0) {
    return (
      <div className="product-list">
        <div className="text-center">{_("There is no product to display")}</div>
      </div>
    );
  }

  let className;
  switch (countPerRow) {
    case 3:
      className = "grid grid-cols-2 md:grid-cols-3 gap-8";
      break;
    case 4:
      className = "grid grid-cols-2 md:grid-cols-4 gap-8";
      break;
    case 5:
      className = "grid grid-cols-2 md:grid-cols-5 gap-8";
      break;
    default:
      className = "grid grid-cols-2 md:grid-cols-3 gap-8";
  }

  console.log(products);

  return (
    <div className={className}>
      {products.map((p) => (
        <Area
          id="productListingItem"
          className="listing-tem"
          product={p}
          key={p.productId}
          coreComponents={[
            {
              component: { default: Thumbnail },
              props: { url: p.url, imageUrl: get(p, "image.url"), alt: p.name },
              sortOrder: 10,
              id: "thumbnail",
            },
            {
              component: { default: Name },
              props: { name: p.name, url: p.url, id: p.productId },
              sortOrder: 20,
              id: "name",
            },
            ...(excursion
              ? [
                  {
                    component: {
                      default: (
                        <div>
                          <p className="monumental font-bold text-[#AEB4B9] text-xs">
                            {p?.category?.path
                              ?.slice(1)
                              .map((p) => p.name)
                              .join(" | ")}
                          </p>
                        </div>
                      ),
                    },
                  },
                ]
              : []),
            {
              component: { default: Price },
              props: { ...p.price, desde: excursion },
              sortOrder: 30,
              id: "price",
            },
          ]}
        />
      ))}
    </div>
  );
}

ProductList.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      sku: PropTypes.string,
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
    })
  ).isRequired,
  countPerRow: PropTypes.number.isRequired,
};

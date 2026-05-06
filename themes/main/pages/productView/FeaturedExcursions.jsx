import React, { useState } from "react";
import { _ } from "@evershop/evershop/src/lib/locale/translate";
import FeaturedSection from "../../components/FeaturedSection/FeaturedSection";

export default function FeaturedExcursions({ myFeaturedProducts }) {
  const [current, setCurrent] = useState(0);

  var excursions = {
    title: _("Featured Excursions"),
    subtitle: _(
      "Explore the most impressive landscapes of the End of the World and live unforgettable experiences with Ushuaia Extremo."
    ),
    button: _("MORE EXCURSIONS"),
    url: "/excursiones",
    elements: myFeaturedProducts.items?.map((p) => ({
      image: p.image?.single || "",
      title: p.name,
      subtitle: (() => {
        const season = p?.category?.path?.[1]?.name ?? "";
        const type = p?.category?.path?.[2]?.name ?? "";

        const subtitle =
          season && type ? `${season} | ${type}` : season ? season : "";
        return subtitle;
      })(),
      price: p.price?.regular?.value,
      url: p.url,
    })),
  };

  const next = () => {
    setCurrent((prev) =>
      prev + 1 >= excursions.elements.length ? 0 : prev + 1
    );
  };

  const prev = () => {
    setCurrent((prev) =>
      prev - 1 < 0 ? excursions.elements.length - 1 : prev - 1
    );
  };

  return (
    <div
      className="w-full pb-5 max-lg:h-fit max-lg:!bg-none mt-10"
      style={{
        backgroundSize: "cover",
      }}
    >
      <div className="mt-10 relative">
        <FeaturedSection
          logo="/images/Logos/Travels.png"
          current={current}
          data={excursions}
        />
      </div>
    </div>
  );
}

export const query = `
  query Query {
    myFeaturedProducts (featuredProduct: true) {
      items {
        productId
        uuid
        name
        attributes: attributeIndex {
          attributeName
          attributeCode
          optionText
        }
        category {
          path {
            name
          }
        }
        image {
          single
        }
        sku
        featuredProduct
        status
        url
        price {
          regular {
            value
            text
          }
        }
      }
    }
  }
`;

export const layout = {
  areaId: "excursionView",
  sortOrder: 3,
};

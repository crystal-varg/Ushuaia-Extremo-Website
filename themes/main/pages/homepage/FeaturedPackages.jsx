import React, { useState } from "react";
import { _ } from "@evershop/evershop/src/lib/locale/translate";
import FeaturedSection from "../../components/FeaturedSection/FeaturedSection";

export default function FeaturedPackages({ featuredPackages }) {
  const [current, setCurrent] = useState(0);

  var excursions = {
    title: _("Promociones Destacados"),
    subtitle: _(
      "Explore the most impressive landscapes of the End of the World and live unforgettable experiences with Ushuaia Extremo."
    ),
    button: _("Ver más Promociones"),
    url: "/excursiones?promos=1",
    elements: featuredPackages.items?.map((item) => ({
      image: item.image?.single,
      title: item.name,
      subtitle: "",
      price: item.price?.regular?.text,
      url: item.url,
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
    <div className="w-full h-[900px] max-lg:h-fit">
      <div className="pt-32 relative">
        <FeaturedSection
          logo="/images/Logos/Travels.png"
          data={excursions}
          current={current}
        />
      </div>
    </div>
  );
}

export const query = `
  query Query {
    featuredPackages (featuredPackage: true) {
      items {
        productId
        uuid
        name
        image {
          single
        }
        sku
        featuredPackage
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
  areaId: "content",
  sortOrder: 3,
};
import React from "react";
import { _ } from "@evershop/evershop/src/lib/locale/translate";
import FeaturedRental from "../../components/FeaturedRental/FeaturedRental";

export default function FeaturedExcursions({
  setting: { otherServicesImages, otherServicesImagesLinks },
}) {
  const categories = otherServicesImages.map((i, index) => ({
    img: i,
    imageHeight: "h-[178.16px]",
    url: otherServicesImagesLinks[index],
  }));
  
  if (categories.lenght <= 0) return <></>;

  return (
    <FeaturedRental
      categories={categories}
      logo=""
      title="Otros Servicios"
      background=""
    ></FeaturedRental>
  );
}

export const layout = {
  areaId: "content",
  sortOrder: 200,
};

export const query = `
  query Query {
    setting {
      otherServicesImages
      otherServicesImagesLinks
    }
  }
`;

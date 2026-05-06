import React from "react";
import FeaturedRental from "../../components/FeaturedRental/FeaturedRental";

export default function FeaturedRentals({
  setting: { rentalImages, rentalImagesTitles, rentalImagesLinks },
}) {
  const categories = rentalImages.map((i, index) => ({
    img: i,
    imageHeight: "h-[178.16px]",
    url: rentalImagesLinks[index],
    title: rentalImagesTitles[index],
  }));

  if (categories.length <= 0) return <></>;

  return (
    <FeaturedRental
      categories={categories}
      button="VER CATALOGO"
      url="/rental"
      logo="/images/Logos/Rental.png"
      title="RENTAL USHUAIA"
      subtitle="Los mejores productos. La elección de nuestros clientes."
    ></FeaturedRental>
  );
}

export const layout = {
  areaId: "content",
  sortOrder: 4,
};

export const query = `
  query Query {
    setting {
      rentalImages
      rentalImagesTitles
      rentalImagesLinks
    }
  }
`;

import React from "react";
import FeaturedRental from "../../components/FeaturedRental/FeaturedRental";

export default function FeaturedRentals2({
  setting: {
    bykesAndAccesoriesImages,
    bykesAndAccesoriesImagesTitles,
    bykesAndAccesoriesImagesLinks,
  },
}) {
  const categories = bykesAndAccesoriesImages.map((i, index) => ({
    img: i,
    imageHeight: "h-[178.16px]",
    url: bykesAndAccesoriesImagesLinks[index],
    title: bykesAndAccesoriesImagesTitles[index],
  }));

  if (categories.lenght <= 0) return <></>;

  return (
    <FeaturedRental
      categories={categories}
      button="VER CATALOGO"
      url="/tienda/bicicletas"
      logo="/images/Logos/Bikes.png"
      title="BICICLETERIA Y ACCESORIOS"
      subtitle="Los mejores productos. La elección de nuestros clientes."
      dark
    ></FeaturedRental>
  );
}

export const layout = {
  areaId: "content",
  sortOrder: 5,
};

export const query = `
  query Query {
    setting {
      bykesAndAccesoriesImages
      bykesAndAccesoriesImagesTitles
      bykesAndAccesoriesImagesLinks
    }
  }
`;

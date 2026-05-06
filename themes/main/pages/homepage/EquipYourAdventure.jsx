import React, { useEffect, useState } from "react";
import { _ } from "@evershop/evershop/src/lib/locale/translate";
import RomboidSelectors from "../../components/RomboidSelectors";
import BlurButton from "../../components/BlurButton";

export default function EquipYourAdventure({
  setting: { sliderImages, sliderImagesLinks },
}) {
  const [image, setImage] = useState(0);

  const images = sliderImages;

  useEffect(() => {
    const interval = setInterval(() => {
      setImage((prevImage) => (prevImage + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const changeImage = (i) => {
    setImage(i);
  };

  return (
    <div className="w-full h-[854px] relative overflow-hidden">
      {images.map((img, index) => (
        <img
          key={`images-${index}`}
          className="h-full w-full absolute -z-10 transition-all object-cover"
          style={{
            left: image === index ? "0%" : image > index ? "-100%" : "100%",
          }}
          src={img}
          alt="bg"
        ></img>
      ))}

      <div
        className="text-center absolute transition-all"
        style={{
          top: "45%",
          left: image === 0 ? "50%" : image === 1 ? "-100%" : "-200%",
          transform: "translateX(-50%) translateY(-50%)",
        }}
      >
        <p className="zuume text-white text-[4rem] font-bold -mb-3">
          Equipamos tu
        </p>
        <p className="monumental text-white text-3xl font-bold">
          <span className="bg-red-600 p-2">AVENTURA</span>
        </p>
      </div>

      <div
        className="w-fit absolute flex flex-col items-center justify-center top-[70%] max-lg:top-[90%]"
        style={{
          left: "50%",
          transform: "translateX(-50%) translateY(-50%)",
        }}
      >
        <BlurButton
          url={sliderImagesLinks[image]}
          text={_("SEE EQUIPMENT")}
          className="mb-4"
        ></BlurButton>
        <RomboidSelectors
          i={image}
          images={images}
          changeImage={changeImage}
        ></RomboidSelectors>
      </div>
    </div>
  );
}

export const layout = {
  areaId: "content",
  sortOrder: 2,
};

export const query = `
  query Query {
    setting {
      sliderImages
      sliderImagesLinks
    }
  }
`;

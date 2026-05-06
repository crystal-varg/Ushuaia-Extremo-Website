import React from "react";
import SliderImage from "./SliderImage";
import "./Slider.css";
import { useState } from "react";
import Selector from "./Selector";

const serie = [0, 1, 2, 3, 4];

export default function Slider() {
  const [current, setCurrent] = useState(0);
  const images = [
    { img: "testImage.jpg" },
    { img: "testImage2.jpg" },
    { img: "testImage3.jpg" },
    { img: "testImage4.jpg" },
    { img: "testImage5.jpg" },
  ];

  const setMainImage = (index) => {
    setCurrent(index);
  };

  const getIndex = (i) => {
    const positions = Array(5).fill(-1);

    for (let offset = -2; offset <= 2; offset++) {
      const originalIndex = (current + offset + 5) % 5;
      const visualPosition = offset + 2;
      positions[originalIndex] = visualPosition;
    }

    return positions[i];
  };

  return (
    <div style={{ textAlign: "center", marginBlock: "15px" }}>
      <h2 style={{ fontSize: "6rem", fontFamily: "Zuume" }}>Destinos</h2>
      <p style={{ fontFamily: "Monumental", fontSize: "1.5rem" }}>
        Hacemos simple lo Extremo
      </p>
      <div
        className="w-full flex justify-center align-middle"
        style={{ height: "clamp(300px, 50vw, 450px)" }}
      >
        {images.map((i, index) => (
          <SliderImage
            onClick={() => setMainImage(index)}
            image={i.img}
            index={getIndex(index)}
            key={`slider-image-${index}`}
          />
        ))}

        <div className="gradient w-full h-full z-50 pointer-events-none"></div>
      </div>
      <Selector setCurrent={setCurrent} current={current} />
    </div>
  );
}

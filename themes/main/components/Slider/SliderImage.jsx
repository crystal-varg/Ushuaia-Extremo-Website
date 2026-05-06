import React from "react";

const imgConfigs = [
  {
    position: -120,
    scale: 0.5,
    z: 10,
  },
  {
    position: -50,
    scale: 0.7,
    z: 20,
  },
  {
    position: 0,
    scale: 1,
    z: 30,
  },
  {
    position: 50,
    scale: 0.7,
    z: 20,
  },
  {
    position: 120,
    scale: 0.5,
    z: 10,
  },
];

export default function SliderImage({ image, index, onClick }) {
  const config = imgConfigs[index];
  return (
    <div
      className="self-center absolute transition-all cursor-pointer"
      style={{
        // left: 540,
        scale: config.scale.toString(),
        zIndex: config.z,
        transform: `translateX(${config.position}%)`,
      }}
    >
      <img
        onClick={onClick}
        className="rounded-[40px] object-cover mb-4"
        src={"/images/" + image}
        style={{
          width: "clamp(180px, 50vw, 800px)",
          height: "clamp(100px, 40vw, 400px)",
        }}
      ></img>
    </div>
  );
}

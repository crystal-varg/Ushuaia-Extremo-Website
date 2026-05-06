import React from "react";

export default function RomboidSelectors({ changeImage, i, images }) {
  return (
    <div className="flex space-x-2 relative">
      {images.map((j, index) => (
        <RomboidSelector
          key={`romboid-${index}`}
          selected={i == index}
          onClick={() => changeImage(index)}
        ></RomboidSelector>
      ))}
    </div>
  );
}

function RomboidSelector({ selected, onClick }) {
  selected = selected ?? false;
  return (
    <div
      onClick={onClick}
      className="w-10 h-10 border-[rgb(255,255,255,.5)] border cursor-pointer"
      style={{
        backdropFilter: "blur(4px)",
        backgroundColor: !selected ? "rgb(0,0,0,.4)" : "white",
        scale: "0.5 0.4",
        transform: "rotate(45deg)",
      }}
    ></div>
  );
}

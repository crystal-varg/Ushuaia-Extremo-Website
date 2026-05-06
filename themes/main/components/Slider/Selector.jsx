import React from "react";

export default function Selector({ current, setCurrent }) {
  const getColor = (index) => {
    if (index == current) return "red";
    else return "gray";
  };

  const next = () => {
    let next = current + 1;
    if (next >= 5) next = 0;
    setCurrent(next);
  };

  const previuous = () => {
    let previuous = current - 1;
    if (previuous < 0) previuous = 4;
    setCurrent(previuous);
  };

  return (
    <div className="w-full mt-5 mb-10">
      <div className="flex justify-center w-[16%] mx-auto">
        <img
          onClick={() => previuous()}
          className="w-10 h-10 my-auto cursor-pointer mx-5"
          style={{ transform: "scale(-1, 1)" }}
          src={"/icons/arrow.png"}
        ></img>
        {[0, 0, 0, 0, 0].map((x, index) => (
          <div
            key={`slider-selector-dot-${index}`}
            className="h-4 w-4 rounded-full z-[70] self-end m-auto cursor-pointer"
            style={{ backgroundColor: getColor(index) }}
            onClick={() => setCurrent(index)}
          ></div>
        ))}
        <img
          className="w-10 h-10 my-auto cursor-pointer mx-5"
          onClick={() => next()}
          src={"/icons/arrow.png"}
        ></img>
      </div>
    </div>
  );
}

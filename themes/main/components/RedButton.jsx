import React from "react";

export default function RedButton({ className, text, onClick }) {
  var classname =
    "w-fit px-10 pb-1 pt-2 text-white text-center rounded-full border-[rgb(255,255,255,.5)] border cursor-pointer max-[400px]:text-sm select-none " +
    className;
  return (
    <div
      className={classname}
      style={{
        backgroundColor: "red",
        fontFamily: "Monumental",
      }}
      onClick={(e) => onClick(e)}
    >
      {text}
    </div>
  );
}

import React from "react";

export default function BlurButton({ className, text, url }) {
  var classname =
    className +
    " cursor-pointer w-fit px-10 pb-1 pt-2 text-white rounded-full border-[rgb(255,255,255,.5)] border text-center";
  return (
    <div
      onClick={() => (window.location.href = url)}
      className={classname}
      style={{
        backdropFilter: "blur(4px)",
        backgroundColor: "rgb(0,0,0,.4)",
        fontFamily: "Monumental",
      }}
    >
      {text}
    </div>
  );
}

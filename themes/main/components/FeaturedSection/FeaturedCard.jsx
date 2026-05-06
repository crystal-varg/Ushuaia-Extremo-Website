import { _ } from "@evershop/evershop/src/lib/locale/translate";
import React from "react";

export default function FeaturedCard({ image, title, price, subtitle, url }) {
  return (
    <a href={url}>
      <div className="h-96 mb-5 w-80 max-lg:mt-2 border border-1 rounded-b-xl bg-white shadow-lg">
        <div
          className="w-full h-52"
          style={{
            transition: "background-image .3s ease-in-out",
            backgroundImage: `url(${image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
        <div className="p-2 h-44 flex flex-col justify-between">
          <div>
            <p className="zuume font-bold text-3xl mb-2">{title}</p>
            <p className="monumental font-bold text-[#AEB4B9] text-xs">{subtitle}</p>
          </div>
          <p className="monumental mb-4">
            <span className="text-[#737373] text-base font-bold mt-auto">
              {_("FROM")}
            </span>{" "}
            <span className="text-xl font-bold">${price.toLocaleString()}</span>
          </p>
        </div>
      </div>
    </a>
  );
}

import React from "react";
import { _ } from "@evershop/evershop/src/lib/locale/translate";

export default function FeaturedTitle({ title, subtitle, dark, logo, white }) {
  const logoImage = logo ?? "/images/logo-UE.png";
  return (
    <div className="flex flex-col mx-auto w-full text-center">
      <div className="flex flex-row">
        <div className="flex flex-col items-center w-full">
          <div className="flex flex-row">
            {!!logoImage && (
              <img className="h-20 mr-5 max-lg:hidden" src={logoImage} alt="UE logo" />
            )}
            <h1
              className={
                "text-7xl font-bold max-lg:break-normal " +
                (dark ? "text-red-600" : "") +
                (white ? " text-white" : "")
              }
              style={{ fontFamily: "zuume" }}
            >
              {title}
            </h1>
          </div>
          {!!subtitle && (
            <p
              className={
                "mt-2 w-2/5 max-lg:w-full text-base mb-4 " +
                (dark ? "text-white" : "") +
                (white ? " text-white" : "")
              }
              style={{ fontFamily: "Monumental" }}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

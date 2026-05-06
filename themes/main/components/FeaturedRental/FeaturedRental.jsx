import React from "react";
import FeaturedTitle from "../FeaturedSection/FeaturedTitle";
import RedButton from "../RedButton";

export default function FeaturedRental({
  button,
  logo,
  title,
  url,
  subtitle,
  dark,
  categories,
  background,
  white,
}) {
  return (
    <div
      className={
        "flex flex-col items-center gap-[34px] pt-16 pb-8 px-0 relative " +
        (dark ? "bg-black" : "")
      }
      style={{
        backgroundImage: background,
        backgroundSize: "cover",
      }}
    >
      <FeaturedTitle
        logo={logo}
        white={white}
        title={title}
        subtitle={subtitle}
        dark={dark}
      ></FeaturedTitle>

      <div className="flex flex-wrap items-end justify-center gap-[12px] self-stretch w-full">
        {categories.map((category, index) => (
          <a
            href={category.url}
            key={index}
            className="flex flex-col w-[230px] items-center gap-[7px] border-none"
          >
            <div className="w-full">
              <h2
                className={
                  "zuume text-black text-2xl text-center " +
                  (dark ? "text-white" : "font-bold")
                }
              >
                {category.title}
              </h2>
              <div
                className={`relative self-stretch w-full ${category.imageHeight} bg-[#d9d9d9]`}
              >
                <img
                  src={category.img}
                  className={`${category.imageHeight} object-cover w-full`}
                  alt=""
                />
              </div>
            </div>
          </a>
        ))}
      </div>
      {button && (
        <div className="flex items-center justify-center w-full px-16 py-0">
          <RedButton
            onClick={() => (window.location.href = url)}
            text={button}
          ></RedButton>
        </div>
      )}
    </div>
  );
}

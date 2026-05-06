import React, { useRef } from "react";
import { _ } from "@evershop/evershop/src/lib/locale/translate";
import FeaturedCard from "./FeaturedCard";
import FeaturedTitle from "./FeaturedTitle";
import RedButton from "../RedButton";
import "./FeaturedSection.css";

export default function FeaturedSection({ data, logo, current }) {
  if (current == null) current = 0;
  let elements = data.elements;
  const container = useRef(null);

  return (
    <>
      <FeaturedTitle logo={logo} title={data.title} subtitle={data.subtitle} />
      <div className="flex flex-row mx-5 space-x-5 overflow-x-auto no-scrollbar justify-center">
        <div
          className="flex flex-row mx-5 space-x-5 overflow-x-auto no-scrollbar"
          ref={container}
        >
          {elements.map((e, i) => (
            <FeaturedCard
              key={`featuredCard${i}`}
              image={e.image}
              subtitle={e.subtitle}
              price={e.price}
              title={e.title}
              url={e.url}
            ></FeaturedCard>
          ))}
        </div>
      </div>
      {data.button && (
        <div className="">
          <div className="mx-10 flex flex-row justify-between">
            <img
              onClick={(e) => {
                e.preventDefault();
                container.current.scrollBy({ left: -335, behavior: "smooth" });
              }}
              className="z-20 cursor-pointer h-fit"
              style={{
                transform: "rotate(180deg)",
              }}
              src="/icons/arrow.png"
              alt=""
            />
            <img
              onClick={(e) => {
                e.preventDefault();
                container.current.scrollBy({ left: 335, behavior: "smooth" });
              }}
              className="z-20 cursor-pointer h-fit"
              src="/icons/arrow.png"
              alt=""
            />
          </div>
          <div className="">
            <RedButton
              onClick={() => (window.location.href = data.url)}
              text={data.button}
              className="h-fit mx-auto"
            ></RedButton>
          </div>
        </div>
      )}
    </>
  );
}

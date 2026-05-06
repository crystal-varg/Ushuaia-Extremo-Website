import { _ } from "@evershop/evershop/src/lib/locale/translate";
import React from "react";
import RedButton from "@components/RedButton";

export default function FeaturedBlogCard({ category, title, description, url, image }) {
  const text = category;

  return (
    <div>
      <div className="h-fit w-80 max-lg:mt-2 border border-1 rounded-b-xl bg-white shadow-lg">
        <div
          className="w-full h-52 cursor-pointer"
          onClick={() => (window.location.href = url)}
          style={{
            transition: "background-image .3s ease-in-out",
            backgroundImage: `url(${image?.url})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
        <div className="p-2 flex flex-col justify-between">
          <div>
            <p className="zuume font-bold text-3xl mb-2 h-[102px] text-ellipsis overflow-hidden">{title}</p>
            <a href={`/blog?category%5Bvalue%5D=${text}&category%5Boperation%5D=eq&limit=12`} className="hover:underline relative self-stretch h-16 monumental font-normal text-[#63687a] text-xs text-ellipsis overflow-hidden">
              {text}
            </a>
          </div>
          <RedButton
            onClick={() => (window.location.href = url)}
            className="text-xs px-2 self-end"
            text="VER MÁS"
          ></RedButton>
        </div>
      </div>
    </div>
  );
}

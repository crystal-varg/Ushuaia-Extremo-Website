import React from "react";
import { _ } from "@evershop/evershop/src/lib/locale/translate";
import FeaturedTitle from "@components/FeaturedSection/FeaturedTitle";
import FeaturedBlogCard from "@components/blog/FeaturedBlogCard";

export default function FeaturedNews({ featuredBlogPages }) {
  return (
    <div className="mt-10 w-full mb-10">
      <FeaturedTitle logo={false} title={_("Featured News")} />
      <div className="flex flex-row flex-wrap justify-center">
        {featuredBlogPages.items.map((page, i) => (
          <div key={"asdfasdfsda" + i} className="mx-5 mt-5">
            <div className="">
              <FeaturedBlogCard
                key={`featuredCard${i}`}
                title={page.name}
                image={page.gallery?.[0]}
                category={page.category}
                description={page.content}
                url={page.url}
              ></FeaturedBlogCard>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export const layout = {
  areaId: "content",
  sortOrder: 6,
};

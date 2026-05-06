import React from "react";
import FeaturedBlogCard from "@components/blog/FeaturedBlogCard.jsx";
import Area from "@components/common/Area";
import { Pagination } from "@components/frontStore/catalog/product/list/Pagination";
import FeaturedNews from "@components/blog/FeaturedNews";

export default function Blog({
  blogPages: { items, currentFilters, total },
  featuredBlogPages,
}) {
  const page = currentFilters.find((filter) => filter.key === "page");
  const limit = currentFilters.find((filter) => filter.key === "limit");
  const category = currentFilters.find((filter) => filter.key === "category");

  return (
    <div>
      <div className="mb-24">
        <FeaturedNews featuredBlogPages={featuredBlogPages}></FeaturedNews>
      </div>
      <h1 className="w-full text-center zuume font-bold text-black">
        NOTICIAS
      </h1>
      <h3 className="w-full text-center monumental font-extrabold text-lg text-[#63687a]">
        {category?.value || "VIVE AL TANTO DE LAS NOTICIAS DE USHUAIA EXTREMO"}
      </h3>
      <div className="h-full flex justify-center mt-10">
        <div className="flex flex-row flex-wrap justify-center">
          {items.map((b, index) => (
            <div
              key={`blogentry-${index}`}
              className="mx-5 mt-5"
            >
              <div className="">
                <FeaturedBlogCard
                  title={b.name}
                  image={b.gallery?.[0]}
                  category={b.category}
                  url={b.url}
                  description={b.content}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <Pagination
        total={total}
        limit={parseInt(limit.value, 10)}
        currentPage={parseInt(page.value, 10)}
      />
      <Area id="blogArea"></Area>
    </div>
  );
}

export const layout = {
  areaId: "content",
  sortOrder: 1,
};

export const query = `
  query Query($filters: [FilterInput]) {
    blogPages (filters: $filters) {
      items {
        cmsPageId
        uuid
        url
        category
        name
        status
        content
      }
      total
      currentFilters {
        key
        operation
        value
      }
    }
    featuredBlogPages {
      items {
        name
        category
        content
        url
        gallery {
          alt
          url
        }
      }
    }
  }
`;

export const variables = `
{
  filters: getContextValue('filtersFromUrl')
}`;

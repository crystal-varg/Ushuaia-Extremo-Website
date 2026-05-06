import React from "react";
import FeaturedNews from "@components/blog/FeaturedNews";

export default function FeaturedExcursions({ featuredBlogPages }) {
  console.log(featuredBlogPages)
  return <FeaturedNews featuredBlogPages={featuredBlogPages}></FeaturedNews>;
}

export const layout = {
  areaId: "content",
  sortOrder: 6,
};

export const query = `
  query Query($filters: [FilterInput]) {
      featuredBlogPages (filters: $filters) {
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

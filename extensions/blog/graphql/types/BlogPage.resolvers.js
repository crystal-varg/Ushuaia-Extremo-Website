const { info, debug } = require("@evershop/evershop/src/lib/log/logger");
const { getConfig } = require("@evershop/evershop/src/lib/util/getConfig");
const {
  CMSPageCollection,
} = require("@evershop/evershop/src/modules/cms/services/CMSPageCollection");
const {
  getBlogPagesBaseQuery,
} = require("../../services/getBlogPagesBaseQuery");
const { getCmsPagesBaseQuery } = require("../../services/getCmsPagesBaseQuery");
const { select } = require("@evershop/postgres-query-builder");
const { camelCase } = require("@evershop/evershop/src/lib/util/camelCase");

module.exports = {
  Query: {
    blogCategories: async (_, __, { pool }) => {
      const query = select("*").from("blog_category").orderBy("name", "asc");
      const categories = await query.execute(pool);
      console.log(categories);
      
      return categories.map((category) => {
        return category.name;
      });
    },
    blogPages: async (_, { filters = [] }, { user }) => {
      if (!filters.includes((f) => f.key == "limit")) {
        filters.push({
          key: "limit",
          operation: "eq",
          value: "3",
        });
      }

      const query = getBlogPagesBaseQuery();
      const root = new CMSPageCollection(query);
      await root.init(filters, !!user);
      return root;
    },
    featuredBlogPages: async (_, { filters = [] }, { user }) => {
      filters = filters ? filters : [];
      if (!filters.includes((f) => f.key == "limit")) {
        filters.push({
          key: "limit",
          operation: "eq",
          value: "3",
        });
      }

      const query = getBlogPagesBaseQuery();
      query.where("featured", "=", "true");
      const root = new CMSPageCollection(query);
      await root.init(filters, !!user);
      return root;
    },
    cmsPages: async (_, { filters = [] }, { user }) => {
      const query = getCmsPagesBaseQuery();
      const root = new CMSPageCollection(query);
      await root.init(filters, !!user);
      return root;
    },
    isBlog: async (_, { id }, { pool }) => {
      const query = select("is_blog")
        .from("cms_page")
        .where("cms_page_id", "=", id);
      const page = await query.load(pool);
      return page?.is_blog;
    },
  },
};

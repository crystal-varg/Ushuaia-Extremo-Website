const {
  getProductsBaseQuery,
} = require("@evershop/evershop/src/modules/catalog/services/getProductsBaseQuery.js");
const {
  ProductCollection,
} = require("@evershop/evershop/src/modules/catalog/services/ProductCollection");
const { info, debug } = require("@evershop/evershop/src/lib/log/logger");
const {
  getProductsByCategoryBaseQuery,
} = require("@evershop/evershop/src/modules/catalog/services/getProductsByCategoryBaseQuery");
const { execute } = require("@evershop/postgres-query-builder");

module.exports = {
  Query: {
    myFeaturedProducts: async (_, { featuredProduct }, { user }) => {
      const query = getProductsBaseQuery();
      query.where("product.featuredProduct", "=", featuredProduct);

      const root = new ProductCollection(query);
      await root.init([], !!user);

      return root;
    },
    featuredPackages: async (_, { featuredPackage }, { user }) => {
      const query = getProductsBaseQuery();
      query.where("product.featuredPackage", "=", featuredPackage);

      const root = new ProductCollection(query);
      await root.init([], !!user);

      return root;
    },
    productsBusiness: async (_, { filters = [] }, { user, pool }) => {
      const query = getProductsBaseQuery();
      const root = new ProductCollection(query);

      const businessFilter = filters.find((f) => f.key === "business");

      if (businessFilter && businessFilter.value) {
        const query2 = await execute(
          pool,
          `WITH RECURSIVE parents AS (
    -- Nodo inicial (la categoría buscada)
    SELECT 
        c.category_id,
        c.parent_id,
        cd.name,
        0 AS level,
        'self' AS direction
    FROM category c
    JOIN category_description cd 
      ON cd.category_description_category_id = c.category_id
    WHERE cd.name ILIKE '${businessFilter.value}'

    UNION ALL

    -- Subir por los padres
    SELECT
        c.category_id,
        c.parent_id,
        cd.name,
        p.level + 1,
        'parent' AS direction
    FROM category c
    JOIN parents p 
      ON p.parent_id = c.category_id
    JOIN category_description cd 
      ON cd.category_description_category_id = c.category_id
),
children AS (
    -- Nodo inicial (la misma categoría)
    SELECT 
        c.category_id,
        c.parent_id,
        cd.name,
        0 AS level,
        'self' AS direction
    FROM category c
    JOIN category_description cd 
      ON cd.category_description_category_id = c.category_id
    WHERE cd.name ILIKE '${businessFilter.value}'

    UNION ALL

    -- Bajar por los hijos
    SELECT
        c.category_id,
        c.parent_id,
        cd.name,
        ch.level + 1,
        'child' AS direction
    FROM category c
    JOIN children ch 
      ON c.parent_id = ch.category_id
    JOIN category_description cd 
      ON cd.category_description_category_id = c.category_id
)

SELECT *
FROM (
    SELECT DISTINCT
        category_id,
        parent_id,
        name,
        direction,
        level
    FROM (
        SELECT * FROM parents
        UNION ALL
        SELECT * FROM children
    ) t
) x
ORDER BY 
    CASE direction 
        WHEN 'self' THEN 0
        WHEN 'parent' THEN 1
        WHEN 'child' THEN 2
    END,
    level;
`
        );
        const categories = query2.rows;
        root.baseQuery.andWhere(
          "product.category_id",
          "IN",
          categories.map((c) => c.category_id)
        );
      }

      await root.init(filters, !!user);

      return root;
    },
  },
  Category: {
    products: async (category, { filters = [] }, { user }) => {
      const query = await getProductsByCategoryBaseQuery(
        category.categoryId,
        !user
      );

      const root = new ProductCollection(query);
      root.baseQuery.orderBy("product.priority", "DESC");
      await root.init(filters, !!user);
      return root;
    },
  },
};

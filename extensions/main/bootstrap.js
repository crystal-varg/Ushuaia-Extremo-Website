const { addProcessor } = require("@evershop/evershop/src/lib/util/registry");
const { getValueSync } = require("@evershop/evershop/src/lib/util/registry");
const { debug } = require("sdk-node-payway/lib/utils/logger");

module.exports = () => {
  const { isAdmin } = this;

  addProcessor(
    "productCollectionFilters",
    (filters) => [
      ...filters,
      {
        key: "ob",
        operation: ["eq"],
        callback: (query, operation, value, currentFilters) => {
          const productSortBy = getValueSync(
            "productCollectionSortBy",
            {
              priority: (query) => query.orderBy("product.priority"),
            },
            {
              isAdmin,
            }
          );

          if (productSortBy[value]) {
            productSortBy[value](query, operation);
            currentFilters.push({
              key: "ob",
              operation,
              value,
            });
          } else {
            query.orderBy("product.product_id", "DESC");
          }
        },
      },
      {
        key: "business",
        operation: ["eq"],
        callback: (query, operation, value, currentFilters) => {
        },
      },
    ],
    1
  );
};

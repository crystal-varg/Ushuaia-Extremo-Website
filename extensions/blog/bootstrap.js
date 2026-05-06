const { addProcessor } = require("@evershop/evershop/src/lib/util/registry");

module.exports = () => {
  addProcessor(
    "cmsPageCollectionFilters",
    (filters) => [
      ...filters,
      {
        key: "category",
        operation: ["eq"],
        callback: (query, operation, value, currentFilters) => {
          query.andWhere('cms_page.category', '=', value);
          currentFilters.push({
            key: "category",
            operation,
            value,
          });
        },
      },
    ],
    3
  );
};

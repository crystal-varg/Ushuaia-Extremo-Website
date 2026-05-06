const {
  buildFilterFromUrl,
} = require("@evershop/evershop/src/lib/util/buildFilterFromUrl");
const {
  setContextValue,
} = require("@evershop/evershop/src/modules/graphql/services/contextHelper.js");

// eslint-disable-next-line no-unused-vars
module.exports = (request, response) => {
  setContextValue(request, "pageInfo", {
    title: "Blog",
    description: "Blog",
  });

  setContextValue(request, "filtersFromUrl", buildFilterFromUrl(request));
};

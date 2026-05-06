const {
  getContextValue,
  setContextValue,
} = require("@evershop/evershop/src/modules/graphql/services/contextHelper.js");

module.exports = (request, response) => {
  const filtersFromUrl = getContextValue(request, "filtersFromUrl");
  const ob = filtersFromUrl.find((o) => o.key === "ob");
  const od = filtersFromUrl.find((o) => o.key === "od");

  const lastFiltersFromUrl = getContextValue(request, "lastFiltersFromUrl", []);
  console.log(lastFiltersFromUrl);
  
  if (ob) {
    console.log("ob");
    console.log(ob);

    lastFiltersFromUrl.push(ob);
  }
  if (od) {
    lastFiltersFromUrl.push(od);
  }

  if (ob || od) {
    setContextValue(request, "lastFiltersFromUrl", lastFiltersFromUrl);
  }
};

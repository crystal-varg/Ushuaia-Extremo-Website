const {
  setContextValue,
} = require('@evershop/evershop/src/modules/graphql/services/contextHelper.js');

module.exports = (request) => {
  setContextValue(request, "pageInfo", {
    title: "Home Setting",
    description: "Home Setting",
  });
};

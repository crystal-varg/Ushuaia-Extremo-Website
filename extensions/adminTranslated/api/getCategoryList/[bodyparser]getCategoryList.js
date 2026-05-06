const { getCategories } = require("./query");

module.exports = async function (request, response) {
  const res = await getCategories();

  return response.json(res);
};

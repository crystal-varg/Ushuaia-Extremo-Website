const { getCategories } = require("./query");

module.exports = async function (request, response) {
  const { id } = request.body;

  const res = await getCategories(id);

  return response.json(res);
};

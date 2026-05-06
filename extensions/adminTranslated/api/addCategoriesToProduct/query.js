const { select } = require("@evershop/postgres-query-builder");
const { pool } = require("@evershop/evershop/src/lib/postgres/connection");

// eslint-disable-next-line no-unused-vars
module.exports = async (request, response, stack, next) => {
  const { body } = request;
  // Check the order
  const order = await select()
    .from("product")
    .where("product_id", "=", body.item)
    .load(pool);

  const categories = [];

  const { rows } = await pool.query(
    "SELECT name FROM category_description WHERE category_description_id = $1",
    [order.category_id]
  );

  categories.push(rows[0]?.name);

  const rows2 = await pool.query(
    "SELECT parent_id FROM category WHERE category_id = $1",
    [order.category_id]
  );

  if (rows2.rows[0].parent_id) {
    const rows3 = await pool.query(
      "SELECT name FROM category_description WHERE category_description_id = $1",
      [rows2.rows[0].parent_id]
    );

    categories.push(rows3.rows[0]?.name);
  }

  response.json(categories);
};

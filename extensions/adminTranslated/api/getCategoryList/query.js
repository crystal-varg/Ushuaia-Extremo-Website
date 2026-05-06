const { pool } = require("@evershop/evershop/src/lib/postgres/connection");

// eslint-disable-next-line no-unused-vars
module.exports = async (request, response, stack, next) => {
  try {
    const { rows: categories } = await pool.query("SELECT * FROM category");
    const data = [];

    for (const item of categories) {
      // nombre de la categoría actual
      const { rows: currentDesc } = await pool.query(
        "SELECT name FROM category_description WHERE category_description_id = $1",
        [item.category_id]
      );

      let name = currentDesc[0]?.name || "(sin nombre)";

      // si tiene padre, buscarlo
      if (item.parent_id) {
        const { rows: parentDesc } = await pool.query(
          "SELECT name FROM category_description WHERE category_description_id = $1",
          [item.parent_id]
        );

        const parentName = parentDesc[0]?.name || "(sin padre)";
        name = `${parentName} > ${name}`;
      }

      data.push(name);
    }

    response.json(data);
  } catch (err) {
    console.error("Error ejecutando query", err);
    response.status(500).json({ error: "Error en servidor" });
  }
};

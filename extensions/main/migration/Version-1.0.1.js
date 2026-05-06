const { execute, insert } = require("@evershop/postgres-query-builder");

module.exports = exports = async (connection) => {
  await execute(
    connection,
    `ALTER TABLE "product" ADD COLUMN "priority" INT DEFAULT 5`
  );
};

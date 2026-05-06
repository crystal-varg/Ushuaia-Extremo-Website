const { execute, insert } = require("@evershop/postgres-query-builder");

module.exports = exports = async (connection) => {
  await execute(
    connection,
    `ALTER TABLE "cms_page" ADD COLUMN "category" TEXT DEFAULT ''`
  );
};

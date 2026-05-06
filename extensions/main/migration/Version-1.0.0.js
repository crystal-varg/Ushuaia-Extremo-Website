const { execute, insert } = require("@evershop/postgres-query-builder");

module.exports = exports = async (connection) => {
  await execute(
    connection,
    `ALTER TABLE "product" ADD COLUMN "featuredProduct" BOOLEAN DEFAULT FALSE`
  );

  await execute(
    connection,
    `ALTER TABLE "product" ADD COLUMN "featuredPackage" BOOLEAN DEFAULT FALSE`
  );
};

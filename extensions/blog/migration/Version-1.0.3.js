const { execute, insert } = require("@evershop/postgres-query-builder");

module.exports = exports = async (connection) => {
  await execute(
    connection,
    `CREATE TABLE "blog_image" (
      "blog_image_id" INT GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1) PRIMARY KEY,
      "uuid" UUID NOT NULL DEFAULT gen_random_uuid (),
      "blog_image_blog_id" INT NOT NULL,
      "image" varchar NOT NULL,
      CONSTRAINT "blog_IMAGE_UUID_UNIQUE" UNIQUE ("uuid")
    )`
  );
};

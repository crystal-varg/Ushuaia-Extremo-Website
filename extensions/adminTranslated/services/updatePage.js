const { hookable } = require("@evershop/evershop/src/lib/util/hookable");
const {
  getValueSync,
  getValue,
} = require("@evershop/evershop/src/lib/util/registry");
const { error } = require("@evershop/evershop/src/lib/log/logger");

const {
  startTransaction,
  commit,
  rollback,
  insert,
  select,
  update,
  insertOnUpdate,
  del,
} = require("@evershop/postgres-query-builder");
const {
  getConnection,
} = require("@evershop/evershop/src/lib/postgres/connection");
const pageDataSchema = require("./pageDataSchema.json");

const Ajv = require("ajv");
const ajvErrors = require("ajv-errors");
const addFormats = require("ajv-formats");

const getAjv = () => {
  // Initialize the ajv instance
  const ajv = new Ajv({
    strict: false,
    useDefaults: "empty",
    allErrors: true,
  });

  // Add the formats
  addFormats(ajv);
  ajv.addFormat("digit", /^[0-9]*$/);
  ajvErrors(ajv);

  return ajv;
};

function validatePageDataBeforeInsert(data) {
  const ajv = getAjv();
  pageDataSchema.required = ["status"];
  const jsonSchema = getValueSync("updatePageDataJsonSchema", pageDataSchema);
  const validate = ajv.compile(jsonSchema);
  const valid = validate(data);
  if (valid) {
    return data;
  } else {
    throw new Error(validate.errors[0].message);
  }
}

async function updatePageData(uuid, data, connection) {
  const query = select().from("cms_page");
  query
    .leftJoin("cms_page_description")
    .on(
      "cms_page_description.cms_page_description_cms_page_id",
      "=",
      "cms_page.cms_page_id"
    );
  const page = await query.where("uuid", "=", uuid).load(connection);

  if (!page) {
    throw new Error("Requested page not found");
  }
  const newPage = await update("cms_page")
    .given(data)
    .where("uuid", "=", uuid)
    .execute(connection);

  Object.assign(page, newPage);
  let description = {};
  try {
    description = await update("cms_page_description")
      .given(data)
      .where("cms_page_description_cms_page_id", "=", page.cms_page_id)
      .execute(connection);
  } catch (e) {
    if (!e.message.includes("No data was provided")) {
      throw e;
    }
  }

  return {
    ...page,
    ...description,
  };
}

/**
 * Update page service. This service will update a page with all related data
 * @param {String} uuid
 * @param {Object} data
 * @param {Object} context
 */
async function updatePage(uuid, data, context) {
  const connection = await getConnection();
  await startTransaction(connection);
  try {
    const pageData = await getValue("pageDataBeforeUpdate", data);
    // Validate page data
    validatePageDataBeforeInsert(pageData);

    // Insert page data
    const page = await hookable(updatePageData, { ...context, connection })(
      uuid,
      pageData,
      connection
    );

    await commit(connection);
    return page;
  } catch (e) {
    await rollback(connection);
    throw e;
  }
}

async function updateImages(images, cms_id, connection) {
  if (Array.isArray(images) && images.length === 0) {
    // Delete all images
    await del("blog_image")
      .where("blog_image_blog_id", "=", cms_id)
      .execute(connection);
  }
  if (Array.isArray(images) && images.length > 0) {
    // eslint-disable-next-line no-useless-catch
    try {
      // Delete all images that not in the gallery anymore
      await del("blog_image")
        .where("blog_image_blog_id", "=", cms_id)
        .execute(connection);
      await Promise.all(
        images.map((f, index) =>
          (async () => {
            const image = await select()
              .from("blog_image")
              .where("blog_image_blog_id", "=", cms_id)
              .load(connection);

            if (!image) {
              await insert("blog_image")
                .given({
                  blog_image_blog_id: cms_id,
                  image: f,
                })
                .execute(connection);
            } else {
              await update("blog_image")
                .given({ image: f })
                .where("blog_image_blog_id", "=", cms_id)
                .execute(connection);
            }
          })()
        )
      );
    } catch (e) {
      error(e);
      throw e;
    }
  }
}

module.exports = async (uuid, data, context) => {
  const connection = await getConnection();
  await startTransaction(connection);
  // Make sure the context is either not provided or is an object
  if (context && typeof context !== "object") {
    throw new Error("Context must be an object");
  }
  const page = await hookable(updatePage, context)(uuid, data, context);

  await hookable(updateImages, { ...context, connection, page })(
    data.images,
    page.cms_page_id,
    connection
  );

  await commit(connection);

  return page;
};

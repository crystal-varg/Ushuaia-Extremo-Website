const { select } = require("@evershop/postgres-query-builder");

module.exports.getBlogPagesBaseQuery = () => {
  const query = select().from("cms_page");
  query
    .leftJoin("cms_page_description")
    .on(
      "cms_page.cms_page_id",
      "=",
      "cms_page_description.cms_page_description_cms_page_id"
    );
  query.where("cms_page.is_blog", "=", "true");

  return query;
};

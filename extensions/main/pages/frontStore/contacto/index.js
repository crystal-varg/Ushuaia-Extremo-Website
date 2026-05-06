const { pool } = require('@evershop/evershop/src/lib/postgres/connection');
const {
  setContextValue
} = require('@evershop/evershop/src/modules/graphql/services/contextHelper.js');
const {
  getCmsPagesBaseQuery
} = require('../../../services/getCmsPagesBaseQuery');

module.exports = async (request, response, delegate, next) => {
  try {
    const query = getCmsPagesBaseQuery();
    query
      .where('cms_page_description.url_key', '=', "contacto")
      .and('cms_page.status', '=', 1);
    const page = await query.load(pool);
    if (page === null) {
      next();
    } else {
      setContextValue(request, 'pageId', page.cms_page_id);
      setContextValue(request, 'pageInfo', {
        title: page.meta_title || page.name,
        description: page.meta_description || page.meta_title,
        url: request.url
      });
      next();
    }
  } catch (e) {
    next(e);
  }
};

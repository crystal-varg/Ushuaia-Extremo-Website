const { v4: uuidv4 } = require('uuid');
const { select } = require('@evershop/postgres-query-builder');

module.exports = {
  CmsPage: {
    image: async (page) => {
      const mainImage = page.originImage;
      return mainImage
        ? {
            thumb: page.thumbImage || null,
            single: page.singleImage || null,
            listing: page.listingImage || null,
            alt: page.name,
            url: mainImage,
            uuid: uuidv4(),
            origin: mainImage
          }
        : null;
    },
    gallery: async (page, _, { pool }) => {
      const gallery = await select()
        .from('blog_image')
        .where('blog_image_blog_id', '=', page.cmsPageId)
        .execute(pool);

        console.log(gallery);
        

      return gallery.map((image) => ({
        id: image.blog_image_id,
        alt: page.name,
        url: image.image,
        uuid: uuidv4(),
        origin: image.origin_image,
        thumb: image.thumb_image,
        single: image.single_image,
        listing: image.listing_image
      }));
    }
  }
};

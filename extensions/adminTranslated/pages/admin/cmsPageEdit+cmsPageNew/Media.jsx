import PropTypes from 'prop-types';
import React from 'react';
import ProductMediaManager from '@components/admin/catalog/productEdit/media/ProductMediaManager';
import { Card } from '@components/admin/cms/Card';
import { _ } from "@evershop/evershop/src/lib/locale/translate";

export default function Media({ id, page, productImageUploadUrl }) {
  const image = page?.image;
  let gallery = page?.gallery || [];

  if (image) {
    gallery = [image].concat(gallery);
  }
  return (
    <Card title={_("Media")}>
      <Card.Session>
        <ProductMediaManager
          id={id || 'images'}
          productImages={gallery}
          productImageUploadUrl={productImageUploadUrl}
        />
      </Card.Session>
    </Card>
  );
}

Media.propTypes = {
  id: PropTypes.string,
  product: PropTypes.shape({
    gallery: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired
      })
    ),
    image: PropTypes.shape({
      id: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired
    })
  }),
  productImageUploadUrl: PropTypes.string.isRequired
};

Media.defaultProps = {
  id: 'images',
  product: null
};

export const layout = {
  areaId: 'wideScreen',
  sortOrder: 300
};

export const query = `
  query Query {
    page: cmsPage(id: getContextValue("cmsPageId", null)) {
      gallery {
        id: uuid
        url
      }
    }
    productImageUploadUrl: url(routeId: "blogImageUpload", params: [{key: "0", value: ""}])
  }
`;

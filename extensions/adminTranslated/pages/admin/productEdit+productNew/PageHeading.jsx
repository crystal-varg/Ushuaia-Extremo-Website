import PropTypes from 'prop-types';
import React from 'react';
import PageHeading from '@components/admin/cms/PageHeading';
import { _ } from "@evershop/evershop/src/lib/locale/translate";

export default function ProductEditPageHeading({ backUrl, product }) {
  return (
    <PageHeading
      backUrl={backUrl}
      heading={product ? `${_("Editing")} ${product.name}` : _('Create a new product')}
    />
  );
}

ProductEditPageHeading.propTypes = {
  backUrl: PropTypes.string.isRequired,
  product: PropTypes.shape({
    name: PropTypes.string.isRequired
  })
};

ProductEditPageHeading.defaultProps = {
  product: null
};

export const layout = {
  areaId: 'content',
  sortOrder: 5
};

export const query = `
  query Query {
    product(id: getContextValue("productId", null)) {
      name
    }
    backUrl: url(routeId: "productGrid")
  }
`;

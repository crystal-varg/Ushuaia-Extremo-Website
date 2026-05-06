import PropTypes from 'prop-types';
import React from 'react';
import Button from '@components/common/form/Button';
import { _ } from "@evershop/evershop/src/lib/locale/translate";

export default function NewProductButton({ newProductUrl }) {
  return <Button url={newProductUrl} title={_("New Product")} />;
}

NewProductButton.propTypes = {
  newProductUrl: PropTypes.string.isRequired
};

export const layout = {
  areaId: 'pageHeadingRight',
  sortOrder: 10
};

export const query = `
  query Query {
    newProductUrl: url(routeId: "productNew")
  }
`;

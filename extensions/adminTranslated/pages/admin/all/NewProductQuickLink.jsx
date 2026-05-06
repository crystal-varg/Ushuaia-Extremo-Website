import PropTypes from 'prop-types';
import React from 'react';
import Icon from '@heroicons/react/solid/esm/ArchiveIcon';
import NavigationItem from '@components/admin/cms/NavigationItem';
import { _ } from "@evershop/evershop/src/lib/locale/translate";

export default function NewProductQuickLink({ productNew }) {
  return <NavigationItem Icon={Icon} title={_("New Product")} url={productNew} />;
}

NewProductQuickLink.propTypes = {
  productNew: PropTypes.string.isRequired
};

export const layout = {
  areaId: 'quickLinks',
  sortOrder: 20
};

export const query = `
  query Query {
    productNew: url(routeId:"productNew")
  }
`;

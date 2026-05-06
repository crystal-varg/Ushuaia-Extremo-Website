import PropTypes from 'prop-types';
import React from 'react';
import Icon from '@heroicons/react/solid/esm/GiftIcon';
import NavigationItemGroup from '@components/admin/cms/NavigationItemGroup';
import { _ } from "@evershop/evershop/src/lib/locale/translate";

export default function CatalogMenuGroup({ couponGrid }) {
  return (
    <NavigationItemGroup
      id="couponMenuGroup"
      name={_("Promotion")}
      items={[
        {
          Icon,
          url: couponGrid,
          title: _('Coupons')
        }
      ]}
    />
  );
}

CatalogMenuGroup.propTypes = {
  couponGrid: PropTypes.string.isRequired
};

export const query = `
  query Query {
    couponGrid: url(routeId:"couponGrid")
  }
`;

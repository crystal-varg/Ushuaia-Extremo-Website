import PropTypes from 'prop-types';
import React from 'react';
import Icon from '@heroicons/react/solid/esm/CubeIcon';
import NavigationItemGroup from '@components/admin/cms/NavigationItemGroup';
import { _ } from "@evershop/evershop/src/lib/locale/translate";

export default function OmsMenuGroup({ orderGrid }) {
  return (
    <NavigationItemGroup
      id="omsMenuGroup"
      name={_("Sale")}
      items={[
        {
          Icon,
          url: orderGrid,
          title: _('Orders')
        }
      ]}
    />
  );
}

OmsMenuGroup.propTypes = {
  orderGrid: PropTypes.string.isRequired
};

export const layout = {
  areaId: 'adminMenu',
  sortOrder: 30
};

export const query = `
  query Query {
    orderGrid: url(routeId:"orderGrid")
  }
`;

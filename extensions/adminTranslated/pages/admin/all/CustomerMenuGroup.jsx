import PropTypes from 'prop-types';
import React from 'react';
import UsersIcon from '@heroicons/react/solid/esm/UsersIcon';
import NavigationItemGroup from '@components/admin/cms/NavigationItemGroup';
import { _ } from "@evershop/evershop/src/lib/locale/translate";

export default function CustomerMenuGroup({ customerGrid }) {
  return (
    <NavigationItemGroup
      id="customerMenuGroup"
      name={_("Customer")}
      items={[
        {
          Icon: UsersIcon,
          url: customerGrid,
          title: _('Customers')
        }
      ]}
    />
  );
}

CustomerMenuGroup.propTypes = {
  customerGrid: PropTypes.string.isRequired
};

export const layout = {
  areaId: 'adminMenu',
  sortOrder: 40
};

export const query = `
  query Query {
    customerGrid: url(routeId:"customerGrid")
  }
`;

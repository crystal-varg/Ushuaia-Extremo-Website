import PropTypes from 'prop-types';
import React from 'react';
import Icon from '@heroicons/react/solid/esm/HomeIcon';
import NavigationItemGroup from '@components/admin/cms/NavigationItemGroup';
import { _ } from "@evershop/evershop/src/lib/locale/translate";

export default function QuickLinks({ dashboard }) {
  return (
    <NavigationItemGroup
      id="quickLinks"
      name={_("Quick links")}
      items={[
        {
          Icon,
          url: dashboard,
          title: _('Dashboard')
        }
      ]}
    />
  );
}

QuickLinks.propTypes = {
  dashboard: PropTypes.string.isRequired
};

export const layout = {
  areaId: 'adminMenu',
  sortOrder: 10
};

export const query = `
  query Query {
    dashboard: url(routeId: "dashboard")
  }
`;

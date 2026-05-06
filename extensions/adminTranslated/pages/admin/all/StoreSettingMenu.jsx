import PropTypes from 'prop-types';
import React from 'react';
import { Card } from '@components/admin/cms/Card';
import { _ } from "@evershop/evershop/src/lib/locale/translate";

export default function StoreSettingMenu({ storeSettingUrl }) {
  return (
    <Card.Session title={<a href={storeSettingUrl}>{_("Store Setting")}</a>}>
      <div>{_("Configure your store information")}</div>
    </Card.Session>
  );
}

StoreSettingMenu.propTypes = {
  storeSettingUrl: PropTypes.string.isRequired
};

export const layout = {
  areaId: 'settingPageMenu',
  sortOrder: 5
};

export const query = `
  query Query {
    storeSettingUrl: url(routeId: "storeSetting")
  }
`;

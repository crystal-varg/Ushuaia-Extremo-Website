import PropTypes from 'prop-types';
import React from 'react';
import { Card } from '@components/admin/cms/Card';
import { _ } from "@evershop/evershop/src/lib/locale/translate";

export default function TaxSettingMenu({ taxSettingUrl }) {
  return (
    <Card.Session title={<a href={taxSettingUrl}>{_("Tax Setting")}</a>}>
      <div>{_("Configure tax classes and tax rates")}</div>
    </Card.Session>
  );
}

TaxSettingMenu.propTypes = {
  taxSettingUrl: PropTypes.string.isRequired
};

export const layout = {
  areaId: 'settingPageMenu',
  sortOrder: 20
};

export const query = `
  query Query {
    taxSettingUrl: url(routeId: "taxSetting")
  }
`;

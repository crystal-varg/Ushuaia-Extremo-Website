import PropTypes from 'prop-types';
import React from 'react';
import { Card } from '@components/admin/cms/Card';
import { _ } from "@evershop/evershop/src/lib/locale/translate";

export default function ShippingSettingMenu({ shippingSettingUrl }) {
  return (
    <Card.Session title={<a href={shippingSettingUrl}>{_("Shipping Setting")}</a>}>
      <div>{_("Where you ship, shipping methods and delivery fee")}</div>
    </Card.Session>
  );
}

ShippingSettingMenu.propTypes = {
  shippingSettingUrl: PropTypes.string.isRequired
};

export const layout = {
  areaId: 'settingPageMenu',
  sortOrder: 15
};

export const query = `
  query Query {
    shippingSettingUrl: url(routeId: "shippingSetting")
  }
`;

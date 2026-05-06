import PropTypes from 'prop-types';
import React from 'react';
import { Card } from '@components/admin/cms/Card';
import { _ } from "@evershop/evershop/src/lib/locale/translate";

export default function PaymentSettingMenu({ paymentSettingUrl }) {
  return (
    <Card.Session title={<a href={paymentSettingUrl}>{_("Payment Setting")}</a>}>
      <div>{_("Configure the available payment methods")}</div>
    </Card.Session>
  );
}

PaymentSettingMenu.propTypes = {
  paymentSettingUrl: PropTypes.string.isRequired
};

export const layout = {
  areaId: 'settingPageMenu',
  sortOrder: 10
};

export const query = `
  query Query {
    paymentSettingUrl: url(routeId: "paymentSetting")
  }
`;

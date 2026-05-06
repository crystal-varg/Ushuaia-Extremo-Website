import PropTypes from 'prop-types';
import React from 'react';
import Icon from '@heroicons/react/solid/esm/GiftIcon';
import NavigationItem from '@components/admin/cms/NavigationItem';
import { _ } from "@evershop/evershop/src/lib/locale/translate";

export default function CouponNewMenuItem({ url }) {
  return <NavigationItem Icon={Icon} title={_("New coupon")} url={url} />;
}

CouponNewMenuItem.propTypes = {
  url: PropTypes.string.isRequired
};

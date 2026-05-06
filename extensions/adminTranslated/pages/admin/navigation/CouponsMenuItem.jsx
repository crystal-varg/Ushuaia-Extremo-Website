import PropTypes from 'prop-types';
import React from 'react';
import Icon from '@heroicons/react/solid/esm/GiftIcon';
import NavigationItem from '@components/admin/cms/NavigationItem';
import { _ } from "@evershop/evershop/src/lib/locale/translate";

export default function CouponsMenuItem({ url }) {
  return <NavigationItem Icon={Icon} title={_("Coupons")} url={url} />;
}

CouponsMenuItem.propTypes = {
  url: PropTypes.string.isRequired
};

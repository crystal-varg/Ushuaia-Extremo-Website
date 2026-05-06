import PropTypes from 'prop-types';
import React from 'react';
import Button from '@components/common/form/Button';
import { _ } from "@evershop/evershop/src/lib/locale/translate";

export default function NewAttributeButton({ newAttributeUrl }) {
  return <Button url={newAttributeUrl} title={_("New Attribute")} />;
}

NewAttributeButton.propTypes = {
  newAttributeUrl: PropTypes.string.isRequired
};

export const layout = {
  areaId: 'pageHeadingRight',
  sortOrder: 10
};

export const query = `
  query Query {
    newAttributeUrl: url(routeId: "attributeNew")
  }
`;

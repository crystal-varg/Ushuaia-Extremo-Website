import PropTypes from 'prop-types';
import React from 'react';
import PageHeading from '@components/admin/cms/PageHeading';
import { _ } from "@evershop/evershop/src/lib/locale/translate";

export default function AttributeEditPageHeading({ backUrl, attribute }) {
  return (
    <PageHeading
      backUrl={backUrl}
      heading={
        attribute
          ? `${_("Editing")} ${attribute.attributeName}`
          : _('Create a new attribute')
      }
    />
  );
}

AttributeEditPageHeading.propTypes = {
  attribute: PropTypes.shape({
    attributeName: PropTypes.string
  }),
  backUrl: PropTypes.string.isRequired
};

AttributeEditPageHeading.defaultProps = {
  attribute: {}
};

export const layout = {
  areaId: 'content',
  sortOrder: 5
};

export const query = `
  query Query {
    attribute(id: getContextValue("attributeId", null)) {
      attributeName
    }
    backUrl: url(routeId: "attributeGrid")
  }
`;

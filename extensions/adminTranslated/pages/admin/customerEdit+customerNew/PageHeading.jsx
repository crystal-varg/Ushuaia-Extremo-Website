import PropTypes from 'prop-types';
import React from 'react';
import PageHeading from '@components/admin/cms/PageHeading';
import { _ } from "@evershop/evershop/src/lib/locale/translate";

export default function CustomerEditPageHeading({ backUrl, customer }) {
  return (
    <PageHeading
      backUrl={backUrl}
      heading={
        customer ? `${_("Editing")} ${customer.fullName}` : _('Create A New Customer')
      }
    />
  );
}

CustomerEditPageHeading.propTypes = {
  backUrl: PropTypes.string.isRequired,
  customer: PropTypes.shape({
    fullName: PropTypes.string.isRequired
  })
};

CustomerEditPageHeading.defaultProps = {
  customer: null
};

export const layout = {
  areaId: 'content',
  sortOrder: 5
};

export const query = `
  query Query {
    customer(id: getContextValue("customerUuid", null)) {
      fullName
    }
    backUrl: url(routeId: "customerGrid")
  }
`;

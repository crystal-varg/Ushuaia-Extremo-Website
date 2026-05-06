import PropTypes from 'prop-types';
import React from 'react';
import { Field } from '@components/common/form/Field';
import { Card } from '@components/admin/cms/Card';
import { _ } from "@evershop/evershop/src/lib/locale/translate";

export default function Status({ category }) {
  return (
    <Card>
      <Card.Session title={_("Status")}>
        <Field
          type="radio"
          name="status"
          options={[
            { value: 0, text: _('Disabled') },
            { value: 1, text: _('Enabled') }
          ]}
          value={category?.status === undefined ? 1 : category.status}
        />
      </Card.Session>
      <Card.Session title={_("Include In Store Menu")}>
        <Field
          type="radio"
          name="include_in_nav"
          options={[
            { value: 0, text: _('No') },
            { value: 1, text: _('Yes') }
          ]}
          value={
            category?.includeInNav === undefined ? 1 : category.includeInNav
          }
        />
      </Card.Session>
      <Card.Session title={_("Show Products?")}>
        <Field
          type="radio"
          name="show_products"
          options={[
            { value: 0, text: _('No') },
            { value: 1, text: _('Yes') }
          ]}
          value={
            category?.showProducts === undefined ? 1 : category.showProducts
          }
        />
      </Card.Session>
    </Card>
  );
}

Status.propTypes = {
  category: PropTypes.shape({
    status: PropTypes.number,
    includeInNav: PropTypes.number,
    showProducts: PropTypes.number
  })
};

Status.defaultProps = {
  category: {}
};

export const layout = {
  areaId: 'rightSide',
  sortOrder: 15
};

export const query = `
  query Query {
    category(id: getContextValue("categoryId", null)) {
      status
      includeInNav
      showProducts
    }
  }
`;

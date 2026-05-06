import PropTypes from "prop-types";
import React from "react";
import { Field } from "@components/common/form/Field";
import { Card } from "@components/admin/cms/Card";
import { _ } from "@evershop/evershop/src/lib/locale/translate";

export default function Status({ product }) {
  return (
    <Card title={_("Product status")} subdued>
      <Card.Session>
        <Field
          id="status"
          name="status"
          isChecked={!!product?.status}
          label={_("Published?")}
          options={[
            { value: 0, text: _("Disabled") },
            { value: 1, text: _("Enabled") },
          ]}
          type="checkbox"
        />
        <Field
          id="visibility"
          name="visibility"
          isChecked={!!product?.visibility}
          label={_("Listed?")}
          options={[
            { value: 0, text: _("Not visible") },
            { value: 1, text: _("Visible") },
          ]}
          type="checkbox"
        />
      </Card.Session>
    </Card>
  );
}

Status.propTypes = {
  product: PropTypes.shape({
    status: PropTypes.number.isRequired,
    visibility: PropTypes.number.isRequired,
  }),
};

Status.defaultProps = {
  product: {
    status: 1,
    visibility: 1,
  },
};

export const layout = {
  areaId: "rightSide",
  sortOrder: 10,
};

export const query = `
  query Query {
    product(id: getContextValue("productId", null)) {
      status
      visibility
      category {
        value: categoryId
        label: name
      }
    }
  }
`;

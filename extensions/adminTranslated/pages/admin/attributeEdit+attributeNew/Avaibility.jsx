import PropTypes from "prop-types";
import React from "react";
import { Field } from "@components/common/form/Field";
import { Card } from "@components/admin/cms/Card";
import { _ } from "@evershop/evershop/src/lib/locale/translate";

export default function General({ attribute }) {
  return (
    <Card title={_("Setting")} subdued>
      <Card.Session>
        <Field
          id="is_required"
          type="radio"
          name="is_required"
          label={_("Is Required?")}
          options={[
            { value: 0, text: _("Not required") },
            { value: 1, text: _("Required") },
          ]}
          value={attribute?.isRequired}
        />
      </Card.Session>
      <Card.Session>
        <Field
          id="is_filterable"
          type="radio"
          name="is_filterable"
          label={_("Is Filterable?")}
          options={[
            { value: 0, text: _("No") },
            { value: 1, text: _("Yes") },
          ]}
          value={attribute?.isFilterable}
        />
      </Card.Session>
      <Card.Session>
        <Field
          id="display_on_frontend"
          type="radio"
          name="display_on_frontend"
          label={_("Show to customers?")}
          options={[
            { value: 0, text: _("No") },
            { value: 1, text: _("Yes") },
          ]}
          value={attribute?.displayOnFrontend}
        />
      </Card.Session>
      <Card.Session>
        <Field
          id="sort_order"
          type="text"
          name="sort_order"
          label={_("Sort order")}
          value={attribute?.sortOrder}
          validationRules={["notEmpty", "number"]}
        />
      </Card.Session>
    </Card>
  );
}

General.propTypes = {
  attribute: PropTypes.shape({
    displayOnFrontend: PropTypes.number,
    isFilterable: PropTypes.number,
    isRequired: PropTypes.number,
    sortOrder: PropTypes.number,
  }),
};

General.defaultProps = {
  attribute: {},
};

export const layout = {
  areaId: "rightSide",
  sortOrder: 10,
};

export const query = `
  query Query {
    attribute(id: getContextValue("attributeId", null)) {
      attributeId
      isFilterable
      isRequired
      displayOnFrontend
      sortOrder
    }
  }
`;

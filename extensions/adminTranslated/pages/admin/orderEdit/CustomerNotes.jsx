import PropTypes from "prop-types";
import React from "react";
import Area from "@components/common/Area";
import { Card } from "@components/admin/cms/Card";
import { _ } from "@evershop/evershop/src/lib/locale/translate";

export default function CustomerNotes({ order: { shippingNote } }) {
  return (
    <Card title={_("Customer notes")}>
      <Card.Session>
        <Area
          id="orderEditCustomerNotes"
          coreComponents={[
            {
              component: {
                // eslint-disable-next-line react/no-unstable-nested-components
                default: () => (
                  <div>
                    {shippingNote || (
                      <span className="text-border">
                        {_("No notes from customer")}
                      </span>
                    )}
                  </div>
                ),
              },
              props: {},
              sortOrder: 10,
              id: "title",
            },
          ]}
          noOuter
        />
      </Card.Session>
    </Card>
  );
}

CustomerNotes.propTypes = {
  order: PropTypes.shape({
    shippingNote: PropTypes.string,
  }).isRequired,
};

export const layout = {
  areaId: "rightSide",
  sortOrder: 10,
};

export const query = `
  query Query {
    order(uuid: getContextValue("orderId")) {
      shippingNote
    }
  }
`;

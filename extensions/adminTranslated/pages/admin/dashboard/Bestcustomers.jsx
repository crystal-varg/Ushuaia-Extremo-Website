import PropTypes from "prop-types";
import React from "react";
import { useAppState } from "@components/common/context/app";
import { Card } from "@components/admin/cms/Card";
import { _ } from "@evershop/evershop/src/lib/locale/translate";

export default function BestCustomers({ listUrl, setting }) {
  const context = useAppState();
  const customers = context.bestCustomers || [];

  return (
    <Card
      title={_("Best customers")}
      actions={[
        {
          name: _("All customers"),
          onAction: () => {
            window.location.href = listUrl;
          },
        },
      ]}
    >
      <Card.Session>
        <table className="listing">
          <thead>
            <tr>
              <th>{_("Full name")}</th>
              <th>{_("Orders")}</th>
              <th>{_("Total")}</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c, i) => {
              const grandTotal = new Intl.NumberFormat("en", {
                style: "currency",
                currency: setting.storeCurrency,
              }).format(c.total);
              return (
                // eslint-disable-next-line react/no-array-index-key
                <tr key={i}>
                  <td>
                    <a href={c.editUrl || ""}>{c.full_name}</a>
                  </td>
                  <td>{c.orders}</td>
                  <td>{grandTotal}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card.Session>
    </Card>
  );
}

BestCustomers.propTypes = {
  setting: PropTypes.shape({
    storeCurrency: PropTypes.string,
  }).isRequired,
  listUrl: PropTypes.string.isRequired,
};

export const query = `
  query Query {
    setting {
      storeCurrency
    }
    listUrl: url(routeId: "productGrid")
  }
`;

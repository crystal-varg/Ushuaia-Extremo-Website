import PropTypes from "prop-types";
import React from "react";
import PageHeading from "@components/admin/cms/PageHeading";
import { _ } from "@evershop/evershop/src/lib/locale/translate";

export default function OrderEditPageHeading({ backUrl, order }) {
  return (
    <PageHeading
      backUrl={backUrl}
      heading={`${_("Editing")} #${order.orderNumber}`}
    />
  );
}

OrderEditPageHeading.propTypes = {
  backUrl: PropTypes.string.isRequired,
  order: PropTypes.shape({
    orderNumber: PropTypes.string.isRequired,
  }).isRequired,
};

export const layout = {
  areaId: "content",
  sortOrder: 5,
};

export const query = `
  query Query {
    order(uuid: getContextValue("orderId", null)) {
      orderNumber
    }
    backUrl: url(routeId: "orderGrid")
  }
`;

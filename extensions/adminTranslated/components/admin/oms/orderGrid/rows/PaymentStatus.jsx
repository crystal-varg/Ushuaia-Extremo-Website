import PropTypes from "prop-types";
import React from "react";
import Badge from "@components/common/Badge";
import { _ } from "@evershop/evershop/src/lib/locale/translate";

export default function PaymentStatusRow({ status }) {
  const translations = {
    Authorized: "Autorizado",
    Failed: "Fallido",
    Refunded: "Reembolsado",
    "Partial Refunded": "Parcialmente Reembolsado",
    processing: "procesando",
    new: "nuevo",
    closed: "cerrado",
    completed: "completo",
    Pending: "Pendiente",
    Paid: "Pagado",
    Canceled: "Cancelado",
  };

  return (
    <td>
      <Badge
        title={translations[status.name] ?? status.name}
        variant={status.badge}
        progress={status.progress}
      />
    </td>
  );
}

PaymentStatusRow.propTypes = {
  status: PropTypes.shape({
    name: PropTypes.string.isRequired,
    badge: PropTypes.string.isRequired,
    progress: PropTypes.string.isRequired,
  }).isRequired,
};

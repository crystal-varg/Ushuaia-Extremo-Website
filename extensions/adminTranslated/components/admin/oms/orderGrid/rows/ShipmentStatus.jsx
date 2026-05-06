import PropTypes from "prop-types";
import React from "react";
import Badge from "@components/common/Badge";

export default function ShipmentStatusRow({ status }) {
  const translations = {
    Pending: "Pendiente",
    Processing: "Procesado",
    Shipped: "Enviado",
    Delivered: "Entregado",
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

ShipmentStatusRow.propTypes = {
  status: PropTypes.shape({
    name: PropTypes.string.isRequired,
    badge: PropTypes.string.isRequired,
    progress: PropTypes.string.isRequired,
  }).isRequired,
};

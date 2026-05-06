import PropTypes from "prop-types";
import React from "react";
import { Field } from "@components/common/form/Field";
import { Toggle } from "@components/common/form/fields/Toggle";
import { Card } from "@components/admin/cms/Card";
import { _ } from "@evershop/evershop/src/lib/locale/translate";

export default function MercadoPagoPayment({
  setting: {
    mercadopagoPaymentStatus,
    mercadopagoDislayName,
    mercadopagoPublishableKey,
    mercadopagoSecretKey,
  },
}) {
  return (
    <Card title={_("MercadoPago Payment")}>
      <Card.Session>
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-1 items-center flex">
            <h4>{_("Enable?")}</h4>
          </div>
          <div className="col-span-2">
            <Toggle
              name="mercadopagoPaymentStatus"
              value={mercadopagoPaymentStatus}
            />
          </div>
        </div>
      </Card.Session>
      <Card.Session>
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-1 items-center flex">
            <h4>{_("Dislay Name")}</h4>
          </div>
          <div className="col-span-2">
            <Field
              type="text"
              name="mercadopagoDislayName"
              placeholder={_("Dislay Name")}
              value={mercadopagoDislayName}
            />
          </div>
        </div>
      </Card.Session>
      <Card.Session>
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-1 items-center flex">
            <h4>{_("Publishable Key")}</h4>
          </div>
          <div className="col-span-2">
            <Field
              type="text"
              name="mercadopagoPublishableKey"
              placeholder={_("Publishable Key")}
              value={mercadopagoPublishableKey}
            />
          </div>
        </div>
      </Card.Session>
      <Card.Session>
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-1 items-center flex">
            <h4>{_("Secret Key")}</h4>
          </div>
          <div className="col-span-2">
            <Field
              type="text"
              name="mercadopagoSecretKey"
              placeholder={_("Secret Key")}
              value={mercadopagoSecretKey}
            />
          </div>
        </div>
      </Card.Session>
    </Card>
  );
}

MercadoPagoPayment.propTypes = {
  setting: PropTypes.shape({
    mercadopagoPaymentStatus: PropTypes.number,
    mercadopagoDislayName: PropTypes.string,
    mercadopagoPublishableKey: PropTypes.string,
    mercadopagoSecretKey: PropTypes.string,
  }).isRequired,
};

export const layout = {
  areaId: "paymentSetting",
  sortOrder: 10,
};

export const query = `
  query Query {
    setting {
      mercadopagoDislayName
      mercadopagoPaymentStatus
      mercadopagoPublishableKey
      mercadopagoSecretKey
    }
  }
`;

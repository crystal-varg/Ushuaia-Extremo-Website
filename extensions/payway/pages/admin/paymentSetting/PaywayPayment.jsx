import PropTypes from "prop-types";
import React from "react";
import { Field } from "@components/common/form/Field";
import { Toggle } from "@components/common/form/fields/Toggle";
import { Card } from "@components/admin/cms/Card";
import { _ } from "@evershop/evershop/src/lib/locale/translate";

export default function PaywayPayment({
  setting: {
    paywayPaymentStatus,
    paywayDislayName,
    paywayPublishableKey,
    paywaySecretKey,
  },
}) {
  return (
    <Card title={_("Payway Payment")}>
      <Card.Session>
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-1 items-center flex">
            <h4>{_("Enable?")}</h4>
          </div>
          <div className="col-span-2">
            <Toggle name="paywayPaymentStatus" value={paywayPaymentStatus} />
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
              name="paywayDislayName"
              placeholder={_("Dislay Name")}
              value={paywayDislayName}
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
              name="paywayPublishableKey"
              placeholder={_("Publishable Key")}
              value={paywayPublishableKey}
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
              name="paywaySecretKey"
              placeholder={_("Secret Key")}
              value={paywaySecretKey}
            />
          </div>
        </div>
      </Card.Session>
    </Card>
  );
}

PaywayPayment.propTypes = {
  setting: PropTypes.shape({
    paywayPaymentStatus: PropTypes.number,
    paywayDislayName: PropTypes.string,
    paywayPublishableKey: PropTypes.string,
    paywaySecretKey: PropTypes.string,
  }).isRequired,
};

export const layout = {
  areaId: "paymentSetting",
  sortOrder: 1,
};

export const query = `
  query Query {
    setting {
      paywayDislayName
      paywayPaymentStatus
      paywayPublishableKey
      paywaySecretKey
    }
  }
`;

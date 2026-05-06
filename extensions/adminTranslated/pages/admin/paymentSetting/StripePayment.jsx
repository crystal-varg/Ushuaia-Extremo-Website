import PropTypes from "prop-types";
import React from "react";
import { Field } from "@components/common/form/Field";
import { Toggle } from "@components/common/form/fields/Toggle";
import { Card } from "@components/admin/cms/Card";
import { _ } from "@evershop/evershop/src/lib/locale/translate";

export default function StripePayment({
  setting: {
    stripePaymentStatus,
    stripeDislayName,
    stripePublishableKey,
    stripeSecretKey,
    stripeEndpointSecret,
    stripePaymentMode,
  },
}) {
  return (
    <Card title={_("Stripe Payment")}>
      <Card.Session>
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-1 items-center flex">
            <h4>{_("Enable?")}</h4>
          </div>
          <div className="col-span-2">
            <Toggle name="stripePaymentStatus" value={stripePaymentStatus} />
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
              name="stripeDislayName"
              placeholder={_("Dislay Name")}
              value={stripeDislayName}
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
              name="stripePublishableKey"
              placeholder={_("Publishable Key")}
              value={stripePublishableKey}
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
              name="stripeSecretKey"
              placeholder={_("Secret Key")}
              value={stripeSecretKey}
            />
          </div>
        </div>
      </Card.Session>
      <Card.Session>
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-1 items-center flex">
            <h4>{_("Webhook Secret Key")}</h4>
          </div>
          <div className="col-span-2">
            <Field
              type="text"
              name="stripeEndpointSecret"
              placeholder={_("Secret Key")}
              value={stripeEndpointSecret}
              instruction={_(
                "Your webhook url should be: https://yourdomain.com/api/stripe/webhook"
              )}
            />
          </div>
        </div>
      </Card.Session>
      <Card.Session>
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-1 items-center flex">
            <h4>{_("Payment mode")}</h4>
          </div>
          <div className="col-span-2">
            <Field
              type="radio"
              name="stripePaymentMode"
              placeholder={_("Payment Mode")}
              value={stripePaymentMode}
              options={[
                { text: _("Authorize only"), value: "authorizeOnly" },
                { text: _("Capture"), value: "capture" },
              ]}
            />
          </div>
        </div>
      </Card.Session>
    </Card>
  );
}

StripePayment.propTypes = {
  setting: PropTypes.shape({
    stripePaymentStatus: PropTypes.number,
    stripeDislayName: PropTypes.string,
    stripePublishableKey: PropTypes.string,
    stripeSecretKey: PropTypes.string,
    stripeEndpointSecret: PropTypes.string,
    stripePaymentMode: PropTypes.string,
  }).isRequired,
};

export const layout = {
  areaId: "paymentSetting",
  sortOrder: 10,
};

export const query = `
  query Query {
    setting {
      stripeDislayName
      stripePaymentStatus
      stripePublishableKey
      stripeSecretKey
      stripeEndpointSecret
      stripePaymentMode
    }
  }
`;

import PropTypes from 'prop-types';
import React from 'react';
import { Field } from '@components/common/form/Field';
import { Toggle } from '@components/common/form/fields/Toggle';
import { Card } from '@components/admin/cms/Card';
import { _ } from "@evershop/evershop/src/lib/locale/translate";

export default function PaypalPayment({
  setting: {
    paypalPaymentStatus,
    paypalDislayName,
    paypalClientId,
    paypalClientSecret,
    paypalEnvironment,
    paypalPaymentIntent
  }
}) {
  return (
    <Card title={_("Paypal Payment")}>
      <Card.Session>
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-1 items-center flex">
            <h4>{_("Enable?")}</h4>
          </div>
          <div className="col-span-2">
            <Toggle name="paypalPaymentStatus" value={paypalPaymentStatus} />
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
              name="paypalDislayName"
              placeholder={_("Dislay Name")}
              value={paypalDislayName}
            />
          </div>
        </div>
      </Card.Session>
      <Card.Session>
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-1 items-center flex">
            <h4>{_("Client ID")}</h4>
          </div>
          <div className="col-span-2">
            <Field
              type="text"
              name="paypalClientId"
              placeholder={_("Client ID")}
              value={paypalClientId}
            />
          </div>
        </div>
      </Card.Session>
      <Card.Session>
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-1 items-center flex">
            <h4>{_("Client Secret")}</h4>
          </div>
          <div className="col-span-2">
            <Field
              type="text"
              name="paypalClientSecret"
              placeholder={_("Secret Key")}
              value={paypalClientSecret}
            />
          </div>
        </div>
      </Card.Session>
      <Card.Session>
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-1 items-center flex">
            <h4>{_("Environment")}</h4>
          </div>
          <div className="col-span-2">
            <Field
              type="radio"
              name="paypalEnvironment"
              placeholder={_("Environment")}
              value={paypalEnvironment}
              options={[
                {
                  text: _('Sandbox'),
                  value: 'https://api-m.sandbox.paypal.com'
                },
                {
                  text: _('Live'),
                  value: 'https://api-m.paypal.com'
                }
              ]}
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
              name="paypalPaymentIntent"
              placeholder={_("Payment Mode")}
              value={paypalPaymentIntent}
              options={[
                { text: _('Authorize only'), value: 'AUTHORIZE' },
                { text: _('Capture'), value: 'CAPTURE' }
              ]}
            />
          </div>
        </div>
      </Card.Session>
    </Card>
  );
}

PaypalPayment.propTypes = {
  setting: PropTypes.shape({
    paypalPaymentStatus: PropTypes.number,
    paypalDislayName: PropTypes.string,
    paypalClientId: PropTypes.string,
    paypalClientSecret: PropTypes.string,
    paypalEnvironment: PropTypes.string,
    paypalPaymentIntent: PropTypes.string
  })
};

PaypalPayment.defaultProps = {
  setting: {
    paypalPaymentStatus: 0,
    paypalDislayName: '',
    paypalClientId: '',
    paypalClientSecret: '',
    paypalEnvironment: '',
    paypalPaymentIntent: 'CAPTURE'
  }
};

export const layout = {
  areaId: 'paymentSetting',
  sortOrder: 15
};

export const query = `
  query Query {
    setting {
      paypalPaymentStatus
      paypalDislayName
      paypalClientId
      paypalClientSecret
      paypalEnvironment
      paypalPaymentIntent
    }
  }
`;

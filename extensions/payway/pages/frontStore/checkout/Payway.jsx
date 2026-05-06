import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useCheckout } from "@components/common/context/checkout";
import CheckoutForm from "@components/frontStore/payway/checkout/CheckoutForm";

function PaywayApp({
  total,
  currency,
  paywayPublishableKey,
  returnUrl,
  createPaywayPaymentApi,
}) {
  const [decidirEnv, setDecidirEnv] = useState(null);

  useEffect(async () => {
    const script = document.createElement("script");

    script.src = "https://live.decidir.com/static/v2.5/decidir.js";
    script.async = true;
    document.body.appendChild(script);

    await new Promise((resolve) => {
      script.onload = () => {
        resolve();
      };
      script.onerror = () => {
        console.error("Failed to load the Decidir script.");
        resolve();
      };
    });

    const urlProduccion = "https://ventasonline.payway.com.ar/api/v2";

    // eslint-disable-next-line no-undef
    const decidirProd = new Decidir(urlProduccion);

    decidirProd.setPublishableKey(paywayPublishableKey);
    decidirProd.setTimeout(3000);

    setDecidirEnv(() => decidirProd);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  if (decidirEnv === null) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <CheckoutForm
        decidirEnv={decidirEnv}
        total={total}
        currency={currency}
        paywayPublishableKey={paywayPublishableKey}
        returnUrl={returnUrl}
        createPaywayPaymentApi={createPaywayPaymentApi}
      />
    </div>
  );
}

PaywayApp.propTypes = {
  paywayPublishableKey: PropTypes.string.isRequired,
  returnUrl: PropTypes.string.isRequired,
  createPaywayPaymentApi: PropTypes.string.isRequired,
  total: PropTypes.number.isRequired,
  currency: PropTypes.string.isRequired,
};

export default function PaywayMethod({
  setting,
  cart: { grandTotal, currency },
  returnUrl,
  createPaywayPaymentApi,
}) {
  const checkout = useCheckout();
  const { paymentMethods, setPaymentMethods } = checkout;
  // Get the selected payment method
  const selectedPaymentMethod = paymentMethods
    ? paymentMethods.find((paymentMethod) => paymentMethod.selected)
    : undefined;

  return (
    <div>
      <div className="flex justify-start items-center gap-4">
        {(!selectedPaymentMethod ||
          selectedPaymentMethod.code !== "payway") && (
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setPaymentMethods((previous) =>
                previous.map((paymentMethod) => {
                  if (paymentMethod.code === "payway") {
                    return {
                      ...paymentMethod,
                      selected: true,
                    };
                  } else {
                    return {
                      ...paymentMethod,
                      selected: false,
                    };
                  }
                })
              );
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-circle"
            >
              <circle cx="12" cy="12" r="10" />
            </svg>
          </a>
        )}
        {selectedPaymentMethod && selectedPaymentMethod.code === "payway" && (
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#2c6ecb"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-check-circle"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
        )}
        <div>{/* Payway Logo */}</div>
      </div>
      <div>
        {selectedPaymentMethod && selectedPaymentMethod.code === "payway" && (
          <div className="mt-5">
            <PaywayApp
              total={grandTotal.value}
              currency={currency}
              paywayPublishableKey={setting.paywayPublishableKey}
              returnUrl={returnUrl}
              createPaywayPaymentApi={createPaywayPaymentApi}
            />
          </div>
        )}
      </div>
    </div>
  );
}

PaywayMethod.propTypes = {
  setting: PropTypes.shape({
    paywayDislayName: PropTypes.string.isRequired,
    paywayPublishableKey: PropTypes.string.isRequired,
  }).isRequired,
  cart: PropTypes.shape({
    grandTotal: PropTypes.shape({
      value: PropTypes.number,
    }),
    currency: PropTypes.string,
  }).isRequired,
  returnUrl: PropTypes.string.isRequired,
  createPaywayPaymentApi: PropTypes.string.isRequired,
};

export const layout = {
  areaId: "checkoutPaymentMethodpayway",
  sortOrder: 10,
};

export const query = `
  query Query {
    setting {
      paywayDislayName
      paywayPublishableKey
    }
    cart {
      grandTotal {
        value
      }
      currency
    }
    returnUrl: url(routeId: "paywayReturn")
    createPaywayPaymentApi: url(routeId: "createPaywayPayment")
  }
`;

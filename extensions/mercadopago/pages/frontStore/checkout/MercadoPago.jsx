import PropTypes from "prop-types";
import React from "react";
import { useCheckout } from "@components/common/context/checkout";
import CheckoutForm from "./CheckoutForm";

function MercadoPagoApp({
  mercadopagoPublishableKey,
  createMercadoPagoPayment,
  confirmPayment
}) {
  return (
    // eslint-disable-next-line react/jsx-filename-extension
    <div className="App">
      <CheckoutForm
        createMercadoPagoPayment={createMercadoPagoPayment}
        confirmPayment={confirmPayment}
        mercadopagoPublishableKey={mercadopagoPublishableKey}
      />
    </div>
  );
}

MercadoPagoApp.propTypes = {
  mercadopagoPublishableKey: PropTypes.string.isRequired,
};

export default function MercadoPagoMethod({
  setting,
  createMercadoPagoPayment,
  confirmPayment
}) {
  const checkout = useCheckout();
  const { paymentMethods, setPaymentMethods } = checkout;
  // Get the selected payment method
  const selectedPaymentMethod = paymentMethods
    ? paymentMethods.find((paymentMethod) => paymentMethod.selected)
    : undefined;

  return (
    <div>
      <div className="flex justify-start items-center gap-1">
        {(!selectedPaymentMethod ||
          selectedPaymentMethod.code !== "mercadopago") && (
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setPaymentMethods((previous) =>
                previous.map((paymentMethod) => {
                  if (paymentMethod.code === "mercadopago") {
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
        {selectedPaymentMethod &&
          selectedPaymentMethod.code === "mercadopago" && (
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
        <div>
          <><img className="h-14" src="/images/mplogo.png"></img></>
        </div>
      </div>
      <div>
        {selectedPaymentMethod &&
          selectedPaymentMethod.code === "mercadopago" && (
            <div>
              <MercadoPagoApp
                mercadopagoPublishableKey={setting.mercadopagoPublishableKey}
                createMercadoPagoPayment={createMercadoPagoPayment}
                confirmPayment={confirmPayment}
              />
            </div>
          )}
      </div>
    </div>
  );
}

MercadoPagoMethod.propTypes = {
  setting: PropTypes.shape({
    mercadopagoPublishableKey: PropTypes.string.isRequired,
  }).isRequired,
};

export const layout = {
  areaId: "checkoutPaymentMethodmercadopago",
  sortOrder: 10,
};

export const query = `
  query Query {
    setting {
      mercadopagoDislayName
      mercadopagoPublishableKey
    }
    createMercadoPagoPayment: url(routeId: "createMercadoPagoPayment")
    confirmPayment: url(routeId: "confirmPayment")
  }
`;

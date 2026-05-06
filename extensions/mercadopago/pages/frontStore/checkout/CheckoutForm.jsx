import PropTypes from "prop-types";
import React, { useState, useEffect, useRef } from "react";
import { useClient, useQuery } from "urql";
import { useCheckout } from "@components/common/context/checkout";
import { CardPayment, initMercadoPago } from "@mercadopago/sdk-react";
import { useCheckoutDispatch } from "@evershop/evershop/src/components/common/context/checkout";
import { toast } from "react-toastify";

const cartQuery = `
  query Query($cartId: String) {
    cart(id: $cartId) {
      grandTotal {
        value
      }
      addPaymentMethodApi
      billingAddress {
        cartAddressId
        fullName
        postcode
        telephone
        country {
          name
          code
        }
        province {
          name
          code
        }
        city
        address1
        address2
      }
      shippingAddress {
        cartAddressId
        fullName
        postcode
        telephone
        country {
          name
          code
        }
        province {
          name
          code
        }
        city
        address1
        address2
      }
      customerEmail
    }
  }
`;

export default function CheckoutForm({
  mercadopagoPublishableKey,
  createMercadoPagoPayment,
  confirmPayment,
}) {
  const { placeOrder } = useCheckoutDispatch();
  const buttonRef = useRef();
  const [loading, setLoading] = useState(false);

  initMercadoPago(mercadopagoPublishableKey);

  const { steps, cartId, orderId, orderPlaced, paymentMethods } = useCheckout();

  const [result] = useQuery({
    query: cartQuery,
    variables: {
      cartId,
    },
  });

  useEffect(() => {
    const pay = async () => {
      await placeOrder();
    };
    if (steps.every((step) => step.isCompleted)) {
      pay();
    }
  }, [steps]);

  useEffect(() => {
    if (orderId) {
      fetch(confirmPayment, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId: orderId }),
      })
        .then(async (data) => {
          window.location.href = "/checkout/success/" + orderId;
        })
        .catch((error) => {
          window.location.href = "/checkout/success/" + orderId;
        });
    }
  }, [orderId]);

  const mercadopagoPaymentMethod = paymentMethods.find(
    (method) => method.code === "mercadopago" && method.selected === true
  );
  if (!mercadopagoPaymentMethod) return null;

  const onSubmit2 = async (formData) => {
    return new Promise((resolve, reject) => {
      setLoading(true);
      fetch(createMercadoPagoPayment, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((response) => response.json())
        .then(async (data) => {
          if (data.status != 200) reject(data.error);
          else resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  const onSubmit = async (formData) => {
    return new Promise((_, reject) => {
      onSubmit2(formData)
        .then(() => {
          buttonRef.current.click();
        })
        .catch((e) => {
          toast.error(e.message);
          reject();
        });
    });
  };

  const onError = async (error) => {
    toast.error(error);
  };

  if (result.fetching) return <div></div>;

  return (
    <div>
      <div
        className="mercadopago-form"
        style={{ display: loading ? "node" : "block" }}
      >
        <CardPayment
          initialization={{
            amount: result.data.cart.grandTotal.value,
          }}
          onSubmit={onSubmit}
          onError={onError}
        />
        <button
          style={{ display: "none" }}
          ref={buttonRef}
          type="submit"
        ></button>
      </div>
    </div>
  );
}

CheckoutForm.propTypes = {
  mercadopagoPublishableKey: PropTypes.string.isRequired,
};

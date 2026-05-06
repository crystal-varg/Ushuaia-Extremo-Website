import PropTypes from "prop-types";
import React, { useState, useEffect, useRef } from "react";
import { useQuery } from "urql";
import {
  useCheckout,
  useCheckoutDispatch,
} from "@components/common/context/checkout";
import "./CheckoutForm.scss";
import { toast } from "react-toastify";
import { _ } from "@evershop/evershop/src/lib/locale/translate";

const cartQuery = `
  query Query($cartId: String) {
    cart(id: $cartId) {
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
  createPaywayPaymentApi,
  returnUrl,
  decidirEnv,
}) {
  const [token, setToken] = useState("");
  const formRef = useRef(null);
  const [bin, setBin] = useState("");

  const { steps, cartId, orderId, orderPlaced, paymentMethods } = useCheckout();
  const { placeOrder, setError } = useCheckoutDispatch();

  const [result] = useQuery({
    query: cartQuery,
    variables: {
      cartId,
    },
    pause: orderPlaced === true,
  });

  useEffect(() => {
    const pay = async () => {
      decidirEnv.createToken(formRef.current, (status, response) => {
        if (status != 200 && status != 201) {
          console.error("Error trying to generate the token", response.error);
          console.table(response.error.map((e) => e.error));
          setError(response.error);
        } else {
          setToken(response.id);
          placeOrder();
        }
      });
    };
    // If all steps are completed, submit the payment
    if (steps.every((step) => step.isCompleted)) {
      pay();
    }
  }, [steps]);

  useEffect(() => {
    if (orderId && orderPlaced) {
      window
        .fetch(createPaywayPaymentApi, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cart_id: cartId,
            order_id: orderId,
            token,
            bin,
          }),
        })
        .catch((err) => {
          console.error("Error:", err);
          toast.error(_("Some error occurred. Please try again later."));
        })
        .then((res) => res.json())
        .then((data) => {
          window.location.href = `${returnUrl}?order_id=${orderId}&id=${data.id}`;
        });
    }
  }, [orderId]);

  if (result.error) {
    return (
      <div className="flex p-8 justify-center items-center text-critical">
        {result.error.message}
      </div>
    );
  }

  const paywayPaymentMethod = paymentMethods.find(
    (method) => method.code === "payway" && method.selected === true
  );
  if (!paywayPaymentMethod) {
    return null;
  }

  return (
    <>
      <form ref={formRef}>
        <fieldset>
          <ul>
            <li>
              <label htmlFor="card_number">Numero de tarjeta:</label>
              <input
                type="text"
                name="card_number"
                id="card_number"
                data-decidir="card_number"
                placeholder="XXXXXXXXXXXXXXXX"
                onChange={(e) => {
                  if (e.target.value.length >= 6) {
                    setBin(e.target.value.substring(0, 6));
                  }
                }}
              />
            </li>
            <li>
              <label htmlFor="security_code">Codigo de seguridad:</label>
              <input
                type="text"
                name="security_code"
                id="security_code"
                data-decidir="security_code"
                placeholder="XXX"
              />
            </li>
            <li>
              <label htmlFor="card_expiration_month">Mes de vencimiento:</label>
              <input
                type="text"
                name="card_expiration_month"
                id="card_expiration_month"
                data-decidir="card_expiration_month"
                placeholder="MM"
              />
            </li>
            <li>
              <label htmlFor="card_expiration_year">Año de vencimiento:</label>
              <input
                type="text"
                name="card_expiration_year"
                id="card_expiration_year"
                data-decidir="card_expiration_year"
                placeholder="AA"
              />
            </li>
            <li>
              <label htmlFor="card_holder_name">Nombre del titular:</label>
              <input
                type="text"
                name="card_holder_name"
                id="card_holder_name"
                data-decidir="card_holder_name"
                placeholder="TITULAR"
              />
            </li>
            <li>
              <label htmlFor="card_holder_doc_type">Tipo de documento:</label>
              <select
                data-decidir="card_holder_doc_type"
                name="card_holder_doc_type"
                id="card_holder_doc_type"
              >
                <option value="dni">DNI</option>
              </select>
            </li>
            <li>
              <label htmlFor="card_holder_doc_type">Numero de documento:</label>
              <input
                type="text"
                data-decidir="card_holder_doc_number"
                placeholder="XXXXXXXXXX"
              />
            </li>
          </ul>
        </fieldset>
      </form>
    </>
  );
}

CheckoutForm.propTypes = {
  returnUrl: PropTypes.string.isRequired,
  createPaywayPaymentApi: PropTypes.string.isRequired,
};

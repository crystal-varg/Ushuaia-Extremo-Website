const { select, update } = require("@evershop/postgres-query-builder");
const { pool } = require("@evershop/evershop/src/lib/postgres/connection");
const { getConfig } = require("@evershop/evershop/src/lib/util/getConfig");
const {
  OK,
  INVALID_PAYLOAD,
} = require("@evershop/evershop/src/lib/util/httpStatus");
const {
  getSetting,
} = require("@evershop/evershop/src/modules/setting/services/setting");
const { sdk: sdkModulo } = require("sdk-node-payway");
const valid = require("card-validator");
const {
  updatePaymentStatus,
} = require("@evershop/evershop/src/modules/oms/services/updatePaymentStatus");
const {
  addNotification,
} = require("@evershop/evershop/src/modules/base/services/notifications");
const { buildUrl } = require("@evershop/evershop/src/lib/router/buildUrl");

module.exports = async (request, response, delegate, next) => {
  const { cart_id, order_id, token, bin } = request.body;

  // Check the cart
  const cart = await select()
    .from("cart")
    .where("uuid", "=", cart_id)
    .load(pool);

  if (!cart) {
    response.status(INVALID_PAYLOAD);
    response.json({
      error: {
        status: INVALID_PAYLOAD,
        message: "Invalid cart",
      },
    });
  } else {
    const paywayConfig = getConfig("system.payway", {});
    let paywayPublishableKey;
    let paywaySecretKey;
    var company = "UshuaiaExtremo";
    var ambient = "production";

    if (paywayConfig.secretKey) {
      paywaySecretKey = paywayConfig.secretKey;
    } else {
      paywaySecretKey = await getSetting("paywaySecretKey", "");
    }

    if (paywayConfig.paywayPublishableKey) {
      paywayPublishableKey = paywayConfig.paywayPublishableKey;
    } else {
      paywayPublishableKey = await getSetting("paywayPublishableKey", "");
    }

    const paywaySDK = new sdkModulo(
      ambient,
      paywayPublishableKey,
      paywaySecretKey,
      company,
      ""
    );

    const numberValidation = valid.number(bin);
    const types = {
      visa: 1,
      mastercard: 104,
      discover: 139,
      other: 63,
    };
    let type = types[numberValidation.card.type];
    type = type != -1 ? type : types["other"];

    const args = {
      site_transaction_id: (new Date().getTime().toString() + order_id).slice(
        0,
        38
      ),
      token: token,
      payment_method_id: type,
      amount: cart.grand_total * 100,
      currency: "ARS",
      bin,
      sub_payments: [],
      installments: 1,
      payment_type: "single",
      apikey: paywaySecretKey,
      "Content-Type": "application/json",
      fraud_detection: {
        send_to_cs: false,
      },
    };

    try {
      const result = await new Promise((resolve, reject) => {
        paywaySDK.payment(args, function (result) {
          resolve(result);
        });
      });
      if (result.status == "approved") {
        response.status(OK);
        response.json({ id: result.id });
      } else {
        const order = await select()
          .from("order")
          .where("uuid", "=", order_id)
          .load(pool);

        if (!order) {
          // Redirect to the home page
          response.status(500);
          return;
        }

        await update("cart")
          .given({ status: true })
          .where("cart_id", "=", order.cart_id)
          .execute(pool);
        await updatePaymentStatus(order.order_id, "failed");
        addNotification(request, "Payment failed", "error");
        request.session.save(() => {
          response.redirect(buildUrl("cart"));
        });
        return;
      }
    } catch (error) {
      response.status(500).json(error);
    }
  }
};

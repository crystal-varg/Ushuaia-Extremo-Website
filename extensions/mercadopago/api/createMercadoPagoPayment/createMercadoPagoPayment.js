const { select } = require("@evershop/postgres-query-builder");
const { pool } = require("@evershop/evershop/src/lib/postgres/connection");
const smallestUnit = require("zero-decimal-currencies");
const {
  getSetting,
} = require("@evershop/evershop/src/modules/setting/services/setting");
const { getConfig } = require("@evershop/evershop/src/lib/util/getConfig");
const { MercadoPagoConfig, Payment } = require("mercadopago");

// eslint-disable-next-line no-unused-vars
module.exports = async (request, response, stack, next) => {
  try {
    const mercadopagoSecretKey = await getSetting('mercadopagoSecretKey', '');

    if (!mercadopagoSecretKey)
      response.json({
        status: 500,
        error: "Cannot get mercadopago settings, contact to admin.",
      });

    const client = new MercadoPagoConfig({
      accessToken: mercadopagoSecretKey,
      options: { timeout: 5000 },
    });

    const payment = new Payment(client);

    const resp = await payment.create({
      body: request.body,
    });

    response.json({
      status: 200,
      transactionId: resp.id,
    });
  } catch (e) {
    response.json({ status: 500, error: e });
  }
};

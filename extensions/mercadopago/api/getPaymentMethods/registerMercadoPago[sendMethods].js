const { getConfig } = require("@evershop/evershop/src/lib/util/getConfig");
const {  getSetting,} = require("@evershop/evershop/src/modules/setting/services/setting");

// eslint-disable-next-line no-unused-vars
module.exports = async (request, response) => {
  // Check if mercadopago is enabled
  const mercadopagoConfig = getConfig("system.mercadopago", {});
  let mercadopagoStatus;
  if (mercadopagoConfig.status) {
    mercadopagoStatus = mercadopagoConfig.status;
  } else {
    mercadopagoStatus = await getSetting("mercadopagoPaymentStatus", 0);
  }
  if (parseInt(mercadopagoStatus, 10) === 1) {
    return {
      methodCode: "mercadopago",
      methodName: await getSetting("mercadopagoDislayName", "MercadoPago"),
    };
  } else {
    return null;
  }
};

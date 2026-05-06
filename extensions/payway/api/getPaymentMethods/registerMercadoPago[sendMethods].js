const { getConfig } = require("@evershop/evershop/src/lib/util/getConfig");
const {
  getSetting,
} = require("@evershop/evershop/src/modules/setting/services/setting");

module.exports = async (request, response) => {
  // Check if payway is enabled
  const paywayConfig = getConfig("system.payway", {});
  let paywayStatus;
  if (paywayConfig.status) {
    paywayStatus = paywayConfig.status;
  } else {
    paywayStatus = await getSetting("paywayPaymentStatus", 0);
  }
  if (parseInt(paywayStatus, 10) === 1) {
    return {
      methodCode: "payway",
      methodName: await getSetting("paywayDislayName", "payway"),
    };
  } else {
    return null;
  }
};

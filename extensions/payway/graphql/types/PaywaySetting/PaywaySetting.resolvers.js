const { getConfig } = require('@evershop/evershop/src/lib/util/getConfig');

module.exports = {
  Setting: {
    paywayPaymentStatus: (setting) => {
      const paywayConfig = getConfig('system.payway', {});
      if (paywayConfig.status) {
        return paywayConfig.status;
      }
      const paywayPaymentStatus = setting.find(
        (s) => s.name === 'paywayPaymentStatus'
      );
      if (paywayPaymentStatus) {
        return parseInt(paywayPaymentStatus.value, 10);
      } else {
        return 0;
      }
    },
    paywayDislayName: (setting) => {
      const paywayDislayName = setting.find(
        (s) => s.name === 'paywayDislayName'
      );
      if (paywayDislayName) {
        return paywayDislayName.value;
      } else {
        return 'Credit Card';
      }
    },
    paywayPublishableKey: (setting) => {
      const paywayConfig = getConfig('system.payway', {});
      if (paywayConfig.publishableKey) {
        return paywayConfig.publishableKey;
      }
      const paywayPublishableKey = setting.find(
        (s) => s.name === 'paywayPublishableKey'
      );
      if (paywayPublishableKey) {
        return paywayPublishableKey.value;
      } else {
        return null;
      }
    },
  }
};

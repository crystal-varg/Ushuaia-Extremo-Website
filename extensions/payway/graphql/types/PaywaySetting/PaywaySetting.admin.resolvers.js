const { getConfig } = require('@evershop/evershop/src/lib/util/getConfig');

module.exports = {
  Setting: {
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
    paywaySecretKey: (setting, _, { user }) => {
      const paywayConfig = getConfig('system.payway', {});
      if (paywayConfig.secretKey) {
        return `${paywayConfig.secretKey.substr(
          0,
          5
        )}*******************************`;
      }
      if (user) {
        const paywaySecretKey = setting.find(
          (s) => s.name === 'paywaySecretKey'
        );
        if (paywaySecretKey) {
          return paywaySecretKey.value;
        } else {
          return null;
        }
      } else {
        return null;
      }
    },
  }
};

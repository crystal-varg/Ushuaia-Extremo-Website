const { getConfig } = require('@evershop/evershop/src/lib/util/getConfig');

module.exports = {
  Setting: {
    mercadopagoPublishableKey: (setting) => {
      const mercadopagoConfig = getConfig('system.mercadopago', {});
      if (mercadopagoConfig.publishableKey) {
        return mercadopagoConfig.publishableKey;
      }
      const mercadopagoPublishableKey = setting.find(
        (s) => s.name === 'mercadopagoPublishableKey'
      );
      if (mercadopagoPublishableKey) {
        return mercadopagoPublishableKey.value;
      } else {
        return null;
      }
    },
    mercadopagoSecretKey: (setting, _, { user }) => {
      const mercadopagoConfig = getConfig('system.mercadopago', {});
      if (mercadopagoConfig.secretKey) {
        return `${mercadopagoConfig.secretKey.substr(
          0,
          5
        )}*******************************`;
      }
      if (user) {
        const mercadopagoSecretKey = setting.find(
          (s) => s.name === 'mercadopagoSecretKey'
        );
        if (mercadopagoSecretKey) {
          return mercadopagoSecretKey.value;
        } else {
          return null;
        }
      } else {
        return null;
      }
    },
  }
};

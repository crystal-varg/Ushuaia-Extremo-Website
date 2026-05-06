const { getConfig } = require('@evershop/evershop/src/lib/util/getConfig');

module.exports = {
  Setting: {
    mercadopagoPaymentStatus: (setting) => {
      const mercadopagoConfig = getConfig('system.mercadopago', {});
      if (mercadopagoConfig.status) {
        return mercadopagoConfig.status;
      }
      const mercadopagoPaymentStatus = setting.find(
        (s) => s.name === 'mercadopagoPaymentStatus'
      );
      if (mercadopagoPaymentStatus) {
        return parseInt(mercadopagoPaymentStatus.value, 10);
      } else {
        return 0;
      }
    },
    mercadopagoDislayName: (setting) => {
      const mercadopagoDislayName = setting.find(
        (s) => s.name === 'mercadopagoDislayName'
      );
      if (mercadopagoDislayName) {
        return mercadopagoDislayName.value;
      } else {
        return 'Credit Card';
      }
    },
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
  }
};

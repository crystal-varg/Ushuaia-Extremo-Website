const { info, debug } = require("@evershop/evershop/src/lib/log/logger");
const { getConfig } = require("@evershop/evershop/src/lib/util/getConfig");

module.exports = {
  Setting: {
    sliderImages: (setting) => {
      const sliderImages = setting.find((s) => s.name === "sliderImages");
      if (sliderImages && sliderImages.value != "") {
        return sliderImages.value.split(",");
      } else {
        return [];
      }
    },
    sliderImagesLinks: (setting) => {
      const sliderImagesLinks = setting.find(
        (s) => s.name === "sliderImagesLinks"
      );
      if (sliderImagesLinks && sliderImagesLinks.value != "") {
        return sliderImagesLinks.value.split(",");
      } else {
        return [];
      }
    },
    rentalImages: (setting) => {
      const rentalImages = setting.find((s) => s.name === "rentalImages");
      if (rentalImages && rentalImages.value != "") {
        return rentalImages.value.split(",");
      } else {
        return [];
      }
    },
    rentalImagesTitles: (setting) => {
      const rentalImagesTitles = setting.find(
        (s) => s.name === "rentalImagesTitles"
      );
      if (rentalImagesTitles && rentalImagesTitles.value != "") {
        return rentalImagesTitles.value.split(",");
      } else {
        return [];
      }
    },
    rentalImagesLinks: (setting) => {
      const rentalImagesLinks = setting.find(
        (s) => s.name === "rentalImagesLinks"
      );
      if (rentalImagesLinks && rentalImagesLinks.value != "") {
        return rentalImagesLinks.value.split(",");
      } else {
        return [];
      }
    },
    bykesAndAccesoriesImages: (setting) => {
      const bykesAndAccesoriesImages = setting.find(
        (s) => s.name === "bykesAndAccesoriesImages"
      );
      if (bykesAndAccesoriesImages && bykesAndAccesoriesImages.value != "") {
        return bykesAndAccesoriesImages.value.split(",");
      } else {
        return [];
      }
    },
    bykesAndAccesoriesImagesTitles: (setting) => {
      const bykesAndAccesoriesImagesTitles = setting.find(
        (s) => s.name === "bykesAndAccesoriesImagesTitles"
      );
      if (
        bykesAndAccesoriesImagesTitles &&
        bykesAndAccesoriesImagesTitles.value != ""
      ) {
        return bykesAndAccesoriesImagesTitles.value.split(",");
      } else {
        return [];
      }
    },
    bykesAndAccesoriesImagesLinks: (setting) => {
      const bykesAndAccesoriesImagesLinks = setting.find(
        (s) => s.name === "bykesAndAccesoriesImagesLinks"
      );
      if (
        bykesAndAccesoriesImagesLinks &&
        bykesAndAccesoriesImagesLinks.value != ""
      ) {
        return bykesAndAccesoriesImagesLinks.value.split(",");
      } else {
        return [];
      }
    },
    otherServicesImages: (setting) => {
      const otherServicesImages = setting.find(
        (s) => s.name === "otherServicesImages"
      );
      if (otherServicesImages && otherServicesImages.value != "") {
        return otherServicesImages.value.split(",");
      } else {
        return [];
      }
    },
    otherServicesImagesLinks: (setting) => {
      const otherServicesImagesLinks = setting.find(
        (s) => s.name === "otherServicesImagesLinks"
      );
      if (otherServicesImagesLinks && otherServicesImagesLinks.value != "") {
        return otherServicesImagesLinks.value.split(",");
      } else {
        return [];
      }
    },
    sponsorsImages: (setting) => {
      const sponsorsImages = setting.find((s) => s.name === "sponsorsImages");
      if (sponsorsImages && sponsorsImages.value != "") {
        return sponsorsImages.value.split(",");
      } else {
        return [];
      }
    },
  },
};

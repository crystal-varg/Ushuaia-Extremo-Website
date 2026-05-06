import PropTypes from "prop-types";
import React from "react";
import { toast } from "react-toastify";
import Area from "@components/common/Area";
import { Form } from "@components/common/form/Form";
import { get } from "@evershop/evershop/src/lib/util/get";
import { _ } from "@evershop/evershop/src/lib/locale/translate";

export default function ProductNewForm({ action }) {
  const id = "productForm";
  return (
    <Form
      method="POST"
      action={action}
      dataFilter={(formData) => {
        if (formData.tax_class === "") {
          // eslint-disable-next-line no-param-reassign
          formData.tax_class = null;
        }
        return formData;
      }}
      onError={() => {
        toast.error(_("Something wrong. Please reload the page!"));
      }}
      onSuccess={(response) => {
        if (response.error) {
          toast.error(
            get(
              response,
              "error.message",
              _("Something wrong. Please reload the page!")
            )
          );
        } else {
          toast.success(_("Product saved successfully!"));
          setTimeout(() => {
            window.location.href = "/admin/products";
          }, 500);
        }
      }}
      submitBtn={false}
      id={id}
    >
      <Area id={id} noOuter />
    </Form>
  );
}

ProductNewForm.propTypes = {
  action: PropTypes.string.isRequired,
};

export const layout = {
  areaId: "content",
  sortOrder: 10,
};

export const query = `
  query Query {
    action: url(routeId: "createProduct")
    gridUrl: url(routeId: "productGrid")
  }
`;

import React from "react";
import { Field } from "@components/common/form/Field";
import { Card } from "@components/admin/cms/Card";
import { _ } from "@evershop/evershop/src/lib/locale/translate";

export default function FeaturedProduct({ product }) {
  return (
    <Card title={_("Featured Product")} subdued>
      <Card.Session>
        <Field
          id="featuredProduct"
          name="featuredProduct"
          isChecked={product?.featuredProduct}
          label={_("Feature as Product")}
          type="checkbox"
        />
        <Field
          id="featuredPackage"
          name="featuredPackage"
          isChecked={product?.featuredPackage}
          label={_("Feature as Package")}
          type="checkbox"
        />
      </Card.Session>
    </Card>
  );
}

export const layout = {
  areaId: "rightSide",
  sortOrder: 11,
};

export const query = `
  query Query {
    product(id: getContextValue("productId", null)) {
      featuredProduct
      featuredPackage
    }
  }
`;

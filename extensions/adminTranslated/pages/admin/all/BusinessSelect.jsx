import React, { useEffect, useState } from "react";
import { Form } from "@components/common/form/Form";
import { Field } from "@components/common/form/Field";
import Area from "@components/common/Area";

export default function BusinessSelect() {
  const [business, setBusiness] = useState(0);

  useEffect(() => {
    setBusiness(
      options.find((o) => o.value == window.localStorage.getItem("business"))
        ?.value ?? ""
    );
  }, []);

  const options = [
    {
      text: "Rental",
      value: "rental",
    },
    {
      text: "Excursiones",
      value: "excursiones",
    },
    {
      text: "Bicicletas",
      value: "bicicletas",
    },
  ];

  return (
    <div className="my-auto ml-5">
      <Form id="asd" submitBtn={false}>
        <Area
          id={"asd"}
          noOuter
          coreComponents={[
            {
              component: { default: Field },
              props: {
                type: "select",
                name: "business",
                disableDefaultOption: false,
                value: business,
                onChange: (e) => {
                  window.localStorage.setItem("business", e.target.value);
                  window.formDirty = false;
                  window.location.reload();
                },
                options,
              },
              sortOrder: 10,
            },
          ]}
        />
      </Form>
    </div>
  );
}

export const layout = {
  areaId: "header",
  sortOrder: 21,
};

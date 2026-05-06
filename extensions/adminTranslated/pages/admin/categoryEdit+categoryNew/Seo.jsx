import PropTypes from "prop-types";
import React from "react";
import Area from "@components/common/Area";
import { get } from "@evershop/evershop/src/lib/util/get";
import { Field } from "@components/common/form/Field";
import { Card } from "@components/admin/cms/Card";
import { _ } from "@evershop/evershop/src/lib/locale/translate";
import { useFormContext } from "@components/common/form/Form";

export default function Seo({ category }) {
  const { fields: formFields } = useFormContext();
  const nameField = formFields.find((ff) => ff.name == "name")?.value ?? "";
  const automaticUrlKey = encodeURIComponent(nameField.toLocaleLowerCase());

  const fields = [
    {
      component: { default: Field },
      props: {
        id: "urlKey",
        name: "url_key",
        label: _("Url key"),
        validationRules: ["notEmpty"],
        type: "text",
        value: automaticUrlKey,
      },
      sortOrder: 0,
    },
    {
      component: { default: Field },
      props: {
        id: "metaTitle",
        name: "meta_title",
        label: _("Meta title"),
        type: "text",
      },
      sortOrder: 10,
    },
    {
      component: { default: Field },
      props: {
        id: "metakeywords",
        name: "meta_keywords",
        label: _("Meta keywords"),
        type: "text",
      },
      sortOrder: 20,
    },
    {
      component: { default: Field },
      props: {
        id: "metaDescription",
        name: "meta_description",
        label: _("Meta description"),
        options: [
          { value: 0, text: "Disabled" },
          { value: 1, text: "Enabled" },
        ],
        type: "textarea",
      },
      sortOrder: 30,
    },
  ].map((f) => {
    if (f.props.name === "url_key") return f;
    if (get(category, `${f.props.id}`) !== undefined) {
      // eslint-disable-next-line no-param-reassign
      f.props.value = get(category, `${f.props.id}`);
    }
    return f;
  });

  return (
    <Card title={_("Search engine optimize")}>
      <Card.Session>
        <Area id="categoryEditSeo" coreComponents={fields} />
      </Card.Session>
    </Card>
  );
}

Seo.propTypes = {
  category: PropTypes.shape({
    metaDescription: PropTypes.string,
    metaKeywords: PropTypes.string,
    metaTitle: PropTypes.string,
    urlKey: PropTypes.string,
  }),
};

Seo.defaultProps = {
  category: {
    metaDescription: "",
    metaKeywords: "",
    metaTitle: "",
    urlKey: "",
  },
};

export const layout = {
  areaId: "leftSide",
  sortOrder: 60,
};

export const query = `
  query Query {
    category(id: getContextValue('categoryId', null)) {
      urlKey
      metaTitle
      metaKeywords
      metaDescription
    }
  }
`;

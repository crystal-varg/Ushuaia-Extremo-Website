import PropTypes from "prop-types";
import React from "react";
import Icon from "@heroicons/react/solid/esm/HomeIcon";
import NavigationItemGroup from "@components/admin/cms/NavigationItemGroup";
import { _ } from "@evershop/evershop/src/lib/locale/translate";

export default function QuickCategories({ dashboard }) {
  return (
    <NavigationItemGroup
      id="quickCategories"
      name={_("Quick Categories")}
      items={[
        {
          Icon,
          url: "/admin/categories?name=rental",
          title: _("Rental"),
        },
        {
          Icon,
          url: "/admin/categories?name=excursiones",
          title: _("Excursions"),
        },
        {
          Icon,
          url: "/admin/categories?name=bicicletas",
          title: _("Bikes"),
        },
      ]}
    />
  );
}

QuickCategories.propTypes = {
  dashboard: PropTypes.string.isRequired,
};


export const query = `
  query Query {
    dashboard: url(routeId: "dashboard")
  }
`;

import PropTypes from "prop-types";
import React from "react";
import Icon from "@heroicons/react/solid/esm/PlusSmIcon";
import NavigationItem from "@components/admin/cms/NavigationItem";
import { _ } from "@evershop/evershop/src/lib/locale/translate";

export default function NewCategoryQuickLink({ categoryNew }) {
  return (
    <NavigationItem Icon={Icon} title={_("New Category")} url={categoryNew} />
  );
}

NewCategoryQuickLink.propTypes = {
  categoryNew: PropTypes.string.isRequired,
};

export const layout = {
  areaId: "quickLinks",
  sortOrder: 40,
};

export const query = `
  query Query {
    categoryNew: url(routeId:"categoryNew")
  }
`;

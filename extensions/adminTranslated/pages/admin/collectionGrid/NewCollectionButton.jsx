import PropTypes from "prop-types";
import React from "react";
import Button from "@components/common/form/Button";
import { _ } from "@evershop/evershop/src/lib/locale/translate";

export default function NewCollectionButton({ newCollectionUrl }) {
  return <Button url={newCollectionUrl} title={_("New Collection")} />;
}

NewCollectionButton.propTypes = {
  newCollectionUrl: PropTypes.string.isRequired,
};

export const layout = {
  areaId: "pageHeadingRight",
  sortOrder: 10,
};

export const query = `
  query Query {
    newCollectionUrl: url(routeId: "collectionNew")
  }
`;

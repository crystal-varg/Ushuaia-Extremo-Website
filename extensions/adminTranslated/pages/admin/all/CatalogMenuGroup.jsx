import PropTypes from "prop-types";
import React from "react";
import AttributeIcon from "@heroicons/react/solid/esm/HashtagIcon";
import CategoryIcon from "@heroicons/react/solid/esm/LinkIcon";
import CollectionIcon from "@heroicons/react/solid/esm/TagIcon";
import ProductIcon from "@heroicons/react/solid/esm/ArchiveIcon";
import NavigationItemGroup from "@components/admin/cms/NavigationItemGroup";
import { _ } from "@evershop/evershop/src/lib/locale/translate";

export default function CatalogMenuGroup({
  productGrid,
  categoryGrid,
  attributeGrid,
  collectionGrid,
}) {
  return (
    <NavigationItemGroup
      id="catalogMenuGroup"
      name={_("Catalog")}
      items={[
        {
          Icon: ProductIcon,
          url: productGrid,
          title: _("Products"),
        },
        {
          Icon: CategoryIcon,
          url: categoryGrid,
          title: _("Categories"),
        },
        // {
        //   Icon: CollectionIcon,
        //   url: collectionGrid,
        //   title: _('Collections')
        // },
        {
          Icon: AttributeIcon,
          url: attributeGrid,
          title: _("Attributes"),
        },
      ]}
    />
  );
}

CatalogMenuGroup.propTypes = {
  attributeGrid: PropTypes.string.isRequired,
  categoryGrid: PropTypes.string.isRequired,
  collectionGrid: PropTypes.string.isRequired,
  productGrid: PropTypes.string.isRequired,
};

export const layout = {
  areaId: "adminMenu",
  sortOrder: 9,
};

export const query = `
  query Query {
    productGrid: url(routeId:"productGrid")
    categoryGrid: url(routeId:"categoryGrid")
    attributeGrid: url(routeId:"attributeGrid")
    collectionGrid: url(routeId:"collectionGrid")
  }
`;

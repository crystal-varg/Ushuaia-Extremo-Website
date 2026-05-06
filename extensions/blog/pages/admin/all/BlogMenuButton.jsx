import React from "react";
import PageIcon from "@heroicons/react/solid/esm/DocumentIcon";
import NavigationItem from "@components/admin/cms/NavigationItem";

export default function BlogMenuButton({ cmsBlogGrid }) {
  return <NavigationItem Icon={PageIcon} url={cmsBlogGrid + "?limit=20"} title="Blog" />;
}

export const layout = {
  areaId: "cmsMenuGroup",
  sortOrder: 1,
};

export const query = `
  query Query {
    cmsBlogGrid: url(routeId:"cmsBlogGrid")
  }
`;

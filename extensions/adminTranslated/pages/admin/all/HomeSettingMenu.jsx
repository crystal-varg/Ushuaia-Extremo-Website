import React from "react";
import { Card } from "@components/admin/cms/Card";
import { _ } from "@evershop/evershop/src/lib/locale/translate";

export default function HomeSettingMenu({ homeSettingUrl }) {
  return (
    <Card.Session title={<a href={homeSettingUrl}>{_("Home Setting")}</a>}>
      <div>{_("Configure images in the homepage")}</div>
    </Card.Session>
  );
}

export const layout = {
  areaId: "settingPageMenu",
  sortOrder: 20,
};

export const query = `
  query Query {
    homeSettingUrl: url(routeId: "homeSetting")
  }
`;

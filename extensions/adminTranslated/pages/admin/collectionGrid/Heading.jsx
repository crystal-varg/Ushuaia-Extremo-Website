import React from "react";
import PageHeading from "@components/admin/cms/PageHeading";
import { _ } from "@evershop/evershop/src/lib/locale/translate";

export default function Heading() {
  return (
    <div className="w-2/3" style={{ margin: "0 auto" }}>
      <PageHeading backUrl={null} heading={_("Collections")} />
    </div>
  );
}

export const layout = {
  areaId: "content",
  sortOrder: 10,
};

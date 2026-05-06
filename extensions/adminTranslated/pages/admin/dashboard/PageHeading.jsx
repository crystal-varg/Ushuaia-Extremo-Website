import React from 'react';
import PageHeading from '@components/admin/cms/PageHeading';
import { _ } from "@evershop/evershop/src/lib/locale/translate";

export default function PageEditPageHeading() {
  return <PageHeading heading={_("Dashboard")} />;
}

export const layout = {
  areaId: 'content',
  sortOrder: 5
};

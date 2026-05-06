import React from 'react';
import PageHeading from '@components/admin/cms/PageHeading';
import { _ } from '@evershop/evershop/src/lib/locale/translate';

export default function Heading() {
  return <PageHeading backUrl={null} heading={_("Attributes")} />;
}

export const layout = {
  areaId: 'content',
  sortOrder: 10
};

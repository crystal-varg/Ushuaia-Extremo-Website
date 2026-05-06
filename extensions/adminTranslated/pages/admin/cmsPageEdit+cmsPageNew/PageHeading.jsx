import React, { useEffect, useState } from "react";
import PageHeading from "@components/admin/cms/PageHeading";
import { _ } from "@evershop/evershop/src/lib/locale/translate";

export default function PageEditPageHeading({ backUrl, backBlogUrl, page, isBlog: blog }) {
  const [isBlog, setIsBlog] = useState(false);

  useEffect(() => {
    const url = new URL(window.location.href);
    const isBlog = url.searchParams.get("blog") == 1 || blog;
    setIsBlog(isBlog);
  }, []);

  return (
    <PageHeading
      backUrl={isBlog ? backBlogUrl : backUrl}
      heading={page ? `${_("Editing")} ${page.name}` : _("Create a new page")}
    />
  );
}

export const layout = {
  areaId: "content",
  sortOrder: 5,
};

export const query = `
  query Query {
    page: cmsPage(id: getContextValue("cmsPageId", null)) {
      name
    }
    isBlog(id: getContextValue("cmsPageId", null))
    backUrl: url(routeId: "cmsPageGrid")
    backBlogUrl: url(routeId: "cmsBlogGrid")
  }
`;

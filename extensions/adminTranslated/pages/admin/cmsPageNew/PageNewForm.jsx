import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Area from "@components/common/Area";
import { Form } from "@components/common/form/Form";
import { get } from "@evershop/evershop/src/lib/util/get";
import { _ } from "@evershop/evershop/src/lib/locale/translate";
import { Field } from "@components/common/form/Field";

export default function CmsPageNewForm({ action }) {
  const [isBlog, setIsBlog] = useState(false);

  useEffect(() => {
    const url = new URL(window.location.href);
    const isBlog = url.searchParams.get("blog") == 1;
    setIsBlog(isBlog);
  }, []);
  const id = "cmsPageForm";
  return (
    <Form
      method="POST"
      action={action}
      onError={() => {
        toast.error(_("Something wrong. Please reload the page!"));
      }}
      onSuccess={(response) => {
        if (response.error) {
          toast.error(
            get(
              response,
              "error.message",
              _("Something wrong. Please reload the page!")
            )
          );
        } else {
          toast.success(_("Page saved successfully!"));
          // Wait for 2 seconds to show the success message
          setTimeout(() => {
            // Redirect to the edit page
            const editUrl = response.data.links.find(
              (link) => link.rel === "edit"
            ).href;
            window.location.href = editUrl;
          }, 1500);
        }
      }}
      submitBtn={false}
      id={id}
    >
      {isBlog ? (
        <Field type="hidden" name="is_blog" value="true"></Field>
      ) : (
        <></>
      )}
      <Area id={id} noOuter />
    </Form>
  );
}

CmsPageNewForm.propTypes = {
  action: PropTypes.string.isRequired,
};

export const layout = {
  areaId: "content",
  sortOrder: 10,
};

export const query = `
  query Query {
    action: url(routeId: "createCmsPage")
    gridUrl: url(routeId: "cmsPageGrid")
  }
`;

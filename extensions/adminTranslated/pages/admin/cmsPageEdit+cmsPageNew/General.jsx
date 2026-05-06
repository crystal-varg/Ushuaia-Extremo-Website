import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import Area from "@components/common/Area";
import { get } from "@evershop/evershop/src/lib/util/get";
import { Field } from "@components/common/form/Field";
import { Card } from "@components/admin/cms/Card";
import Editor from "@components/common/form/fields/Editor";
import { _ } from "@evershop/evershop/src/lib/locale/translate";
import ProductMediaManager from "@components/admin/catalog/productEdit/media/ProductMediaManager";
import Select from "react-select";
import { useQuery } from "urql";
import { Input } from "@components/common/form/fields/Input";

const CategoriesQuery = `
  query Query {
    blogCategories: blogCategories
  }
`;

export default function General({
  page,
  browserApi,
  deleteApi,
  productImageUploadUrl,
  uploadApi,
  folderCreateApi,
  createCategoryApi,
}) {
  const [result, reexecuteQuery] = useQuery({
    query: CategoriesQuery,
  });
  const { data, fetching, error } = result;

  const [isBlog, setIsBlog] = useState(false);
  const [ready, setReady] = useState(false);
  const newCategory = React.useRef(null);
  const [createCategoryError, setCreateCategoryError] = React.useState(null);

  const [category, setCategory] = useState(page?.category || null);

  const createCategory = () => {
    if (!newCategory.current.value) {
      setCreateCategoryError(_("Nombre es requerido"));
      return;
    }
    fetch(createCategoryApi, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: newCategory.current.value }),
    })
      .then((response) => response.json())
      .then((jsonData) => {
        if (!jsonData.error) {
          newCategory.current.value = "";
          reexecuteQuery({ requestPolicy: "network-only" });
        } else {
          setCreateCategoryError(jsonData.error.message);
        }
      });
  };

  useEffect(() => {
    const url = new URL(window.location.href);
    const isBlog = url.searchParams.get("blog") == 1;
    setIsBlog(isBlog);
    setReady(true);
  }, []);

  const fields = [
    {
      component: { default: Field },
      props: {
        type: "text",
        id: "name",
        name: "name",
        label: _("Name"),
        placeholder: _("Name"),
        validationRules: ["notEmpty"],
      },
      sortOrder: 10,
    },
    {
      component: { default: Field },
      props: {
        id: "cmsPageId",
        name: "cms_page_id",
        type: "hidden",
      },
      sortOrder: 10,
    },
    ...(isBlog
      ? [
          {
            component: { default: Field },
            props: {
              id: "featured",
              name: "featured",
              type: "checkbox",
              isChecked: page?.featured || false,
              label: "Destacar?",
            },
            sortOrder: 10,
          },
        ]
      : []),
    ...(isBlog
      ? [
          {
            component: {
              default: () => (
                <div id="asd">
                  <div className="grid gap-8 grid-cols-2">
                    <div>
                      <Select
                        name="category"
                        className="z-[9999]"
                        options={
                          data?.blogCategories.map((o) => ({
                            value: o,
                            label: o,
                          })) || []
                        }
                        placeholder="Seleccionar..."
                        onChange={(o) => setCategory(o.value)}
                        defaultValue={{ value: category, label: category }}
                      />
                    </div>
                    <div className="grid gap-8 grid-cols-1">
                      <div>
                        <Input
                          type="text"
                          ref={newCategory}
                          error={createCategoryError}
                          placeholder={_("Nueva Categoría")}
                          suffix={
                            <a
                              className="text-interactive"
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                createCategory();
                              }}
                            >
                              <svg
                                width="1.5rem"
                                height="1.5rem"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-6 h-6"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                            </a>
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ),
            },
            // component: { default: Field },
            props: {
              id: "category",
              name: "category",
              type: "text",
              value: page?.category || "",
              label: "Categoria2",
            },
            sortOrder: 11,
          },
        ]
      : []),

    ...(ready
      ? [
          {
            component: { default: Editor },
            props: {
              id: "content",
              name: "content",
              label: _("Contenido"),
              browserApi,
              deleteApi,
              uploadApi,
              folderCreateApi,
            },
            sortOrder: 30,
          },
        ]
      : []),
  ].map((f) => {
    if (get(page, `${f.props.id}`) !== undefined) {
      // eslint-disable-next-line no-param-reassign
      let value = get(page, `${f.props.id}`);
      if (typeof value == "boolean") {
        value = value.toString();
      }
      f.props.value = value;
    }
    return f;
  });

  return (
    <Card title={_("General")}>
      <Card.Session>
        <Area id="pageEditGeneral" coreComponents={fields} />
      </Card.Session>
    </Card>
  );
}

General.propTypes = {
  page: PropTypes.shape({
    cmsPageId: PropTypes.number,
    name: PropTypes.string,
    content: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        size: PropTypes.number.isRequired,
        columns: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.string.isRequired,
            size: PropTypes.number.isRequired,
            // eslint-disable-next-line react/forbid-prop-types
            data: PropTypes.object.isRequired,
          })
        ),
      })
    ),
  }),
  browserApi: PropTypes.string.isRequired,
  deleteApi: PropTypes.string.isRequired,
  folderCreateApi: PropTypes.string.isRequired,
  uploadApi: PropTypes.string.isRequired,
};

General.defaultProps = {
  page: {
    cmsPageId: null,
    name: "",
    content: "",
  },
};

export const layout = {
  areaId: "wideScreen",
  sortOrder: 10,
};

export const query = `
  query Query {
    page: cmsPage(id: getContextValue("cmsPageId", null)) {
      cmsPageId
      name
      content
      featured
      category
    }
    browserApi: url(routeId: "fileBrowser", params: [{key: "0", value: ""}])
    deleteApi: url(routeId: "fileDelete", params: [{key: "0", value: ""}])
    uploadApi: url(routeId: "imageUpload", params: [{key: "0", value: ""}])
    productImageUploadUrl: url(routeId: "imageUpload", params: [{key: "0", value: ""}])
    folderCreateApi: url(routeId: "folderCreate")
    createCategoryApi: url(routeId: "createBlogCategory")
  }
`;

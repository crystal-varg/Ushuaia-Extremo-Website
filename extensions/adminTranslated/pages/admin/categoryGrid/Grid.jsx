/* eslint-disable react/no-array-index-key */
/* eslint-disable react/no-unstable-nested-components */
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Area from "@components/common/Area";
import Pagination from "@components/common/grid/Pagination";
import { useAlertContext } from "@components/common/modal/Alert";
import { Checkbox } from "@components/common/form/fields/Checkbox";
import { Card } from "@components/admin/cms/Card";
import CategoryNameRow from "@components/admin/catalog/categoryGrid/rows/CategoryName";
import StatusRow from "@components/common/grid/rows/StatusRow";
import YesNoRow from "@components/common/grid/rows/YesNoRow";
import SortableHeader from "@components/common/grid/headers/Sortable";
import { Form } from "@components/common/form/Form";
import { Field } from "@components/common/form/Field";
import { _ } from "@evershop/evershop/src/lib/locale/translate";

function Actions({ categories = [], selectedIds = [] }) {
  const { openAlert, closeAlert } = useAlertContext();
  const [isLoading, setIsLoading] = useState(false);

  const deleteCategories = async () => {
    setIsLoading(true);
    const promises = categories
      .filter((category) => selectedIds.includes(category.uuid))
      .map((category) => axios.delete(category.deleteApi));
    await Promise.all(promises);
    setIsLoading(false);
    // Refresh the page
    window.location.reload();
  };

  const actions = [
    {
      name: _("Delete"),
      onAction: () => {
        openAlert({
          heading: `${_("Delete")} ${selectedIds.length} ${_("categories")}`,
          content: <div>Can&apos;t be undone</div>,
          primaryAction: {
            title: _("Cancel"),
            onAction: closeAlert,
            variant: "primary",
          },
          secondaryAction: {
            title: _("Delete"),
            onAction: async () => {
              await deleteCategories();
            },
            variant: "critical",
            isLoading,
          },
        });
      },
    },
  ];

  return (
    <tr>
      {selectedIds.length === 0 && null}
      {selectedIds.length > 0 && (
        <td style={{ borderTop: 0 }} colSpan="100">
          <div className="inline-flex border border-divider rounded justify-items-start">
            <a href="#" className="font-semibold pt-3 pb-3 pl-6 pr-6">
              {selectedIds.length} {_("selected")}
            </a>
            {actions.map((action, index) => (
              <a
                key={index}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  action.onAction();
                }}
                className="font-semibold pt-3 pb-3 pl-6 pr-6 block border-l border-divider self-center"
              >
                <span>{action.name}</span>
              </a>
            ))}
          </div>
        </td>
      )}
    </tr>
  );
}

Actions.propTypes = {
  selectedIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      uuid: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default function CategoryGrid({
  categories: { items: categories, total, currentFilters = [] },
}) {
  const [currentCategories, setCurrentCategories] = useState(categories);

  useEffect(() => {
    const url = new URL(document.location);
    const business = window.localStorage.getItem("business");

    setCurrentCategories(
      categories.filter((c) =>
        c.path.some((p) =>
          p?.name?.toLowerCase().includes(business?.toLowerCase())
        )
      )
    );
  }, []);

  const page = currentFilters.find((filter) => filter.key === "page")
    ? parseInt(currentFilters.find((filter) => filter.key === "page").value, 10)
    : 1;
  const limit = currentFilters.find((filter) => filter.key === "limit")
    ? parseInt(
        currentFilters.find((filter) => filter.key === "limit").value,
        10
      )
    : 20;
  const [selectedRows, setSelectedRows] = useState([]);

  return (
    <Card>
      <Card.Session
        title={
          <Form submitBtn={false} id="categoryGridFilter">
            <Field
              type="text"
              id="name"
              name="name"
              placeholder={_("Search")}
              value={currentFilters.find((f) => f.key === "name")?.value}
              onKeyPress={(e) => {
                // If the user press enter, we should submit the form
                if (e.key === "Enter") {
                  const url = new URL(document.location);
                  const name = document.getElementById("name")?.value;
                  if (name) {
                    url.searchParams.set("name", name);
                  } else {
                    url.searchParams.delete("name");
                  }
                  window.location.href = url;
                }
              }}
            />
          </Form>
        }
        actions={[
          {
            variant: "interactive",
            name: _("Clear filter"),
            onAction: () => {
              // Just get the url and remove all query params
              const url = new URL(document.location);
              url.search = "";
              window.location.href = url.href;
            },
          },
        ]}
      />
      <table className="listing sticky">
        <thead>
          <tr>
            <th className="align-bottom">
              <Checkbox
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedRows(currentCategories.map((c) => c.uuid));
                  } else {
                    setSelectedRows([]);
                  }
                }}
              />
            </th>
            <Area
              className=""
              id="categoryGridHeader"
              noOuter
              coreComponents={[
                {
                  component: {
                    default: () => (
                      <SortableHeader
                        title={_("Category Name")}
                        name="name"
                        currentFilters={currentFilters}
                      />
                    ),
                  },
                  sortOrder: 10,
                },
                {
                  component: {
                    default: () => (
                      <SortableHeader
                        name="status"
                        title={_("Status")}
                        currentFilters={currentFilters}
                      />
                    ),
                  },
                  sortOrder: 25,
                },
                {
                  component: {
                    default: () => (
                      <SortableHeader
                        name="include_in_nav"
                        title={_("Include In Menu")}
                        currentFilters={currentFilters}
                      />
                    ),
                  },
                  sortOrder: 30,
                },
              ]}
            />
          </tr>
        </thead>
        <tbody>
          <Actions
            categories={currentCategories}
            selectedIds={selectedRows}
            setSelectedRows={setSelectedRows}
          />
          {currentCategories.map((c) => (
            <tr key={c.categoryId}>
              <td style={{ width: "2rem" }}>
                <Checkbox
                  isChecked={selectedRows.includes(c.uuid)}
                  onChange={(e) => {
                    if (e.target.checked)
                      setSelectedRows(selectedRows.concat([c.uuid]));
                    else
                      setSelectedRows(selectedRows.filter((r) => r !== c.uuid));
                  }}
                />
              </td>
              <Area
                className=""
                id="categoryGridRow"
                row={c}
                noOuter
                coreComponents={[
                  {
                    component: {
                      default: () => <CategoryNameRow id="name" category={c} />,
                    },
                    sortOrder: 10,
                  },
                  {
                    component: {
                      default: ({ areaProps }) => (
                        <StatusRow id="status" areaProps={areaProps} />
                      ),
                    },
                    sortOrder: 25,
                  },
                  {
                    component: {
                      default: () => <YesNoRow value={c.includeInNav} />,
                    },
                    sortOrder: 30,
                  },
                ]}
              />
            </tr>
          ))}
        </tbody>
      </table>
      {currentCategories.length === 0 && (
        <div className="flex w-full justify-center">
          {_("There is no category to display")}
        </div>
      )}
      <Pagination total={total} limit={limit} page={page} />
    </Card>
  );
}

CategoryGrid.propTypes = {
  categories: PropTypes.shape({
    items: PropTypes.arrayOf(
      PropTypes.shape({
        categoryId: PropTypes.number.isRequired,
        uuid: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        status: PropTypes.number.isRequired,
        includeInNav: PropTypes.number.isRequired,
        editUrl: PropTypes.string.isRequired,
        deleteApi: PropTypes.string.isRequired,
        path: PropTypes.arrayOf(
          PropTypes.shape({
            name: PropTypes.string.isRequired,
          })
        ),
      })
    ).isRequired,
    total: PropTypes.number.isRequired,
    currentFilters: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        operation: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
      })
    ),
  }).isRequired,
};

export const layout = {
  areaId: "content",
  sortOrder: 20,
};
export const query = `
  query Query($filters: [FilterInput]) {
    categories (filters: $filters) {
      items {
        categoryId
        uuid
        name
        status
        includeInNav
        editUrl
        deleteApi
        path {
          name
        }
      }
      total
      currentFilters {
        key
        operation
        value
      }
    }
  }
`;

export const variables = `
{
  filters: getContextValue('filtersFromUrl')
}`;

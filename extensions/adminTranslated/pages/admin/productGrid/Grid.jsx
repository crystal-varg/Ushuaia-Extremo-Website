/* eslint-disable react/no-unstable-nested-components,no-nested-ternary */
import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Area from "@components/common/Area";
import Pagination from "@components/common/grid/Pagination";
import { Checkbox } from "@components/common/form/fields/Checkbox";
import { useAlertContext } from "@components/common/modal/Alert";
import ProductNameRow from "@components/admin/catalog/productGrid/rows/ProductName";
import StatusRow from "@components/common/grid/rows/StatusRow";
import ProductPriceRow from "@components/admin/catalog/productGrid/rows/PriceRow";
import BasicRow from "@components/common/grid/rows/BasicRow";
import ThumbnailRow from "@components/admin/catalog/productGrid/rows/ThumbnailRow";
import { Card } from "@components/admin/cms/Card";
import DummyColumnHeader from "@components/common/grid/headers/Dummy";
import QtyRow from "@components/admin/catalog/productGrid/rows/QtyRow";
import SortableHeader from "@components/common/grid/headers/Sortable";
import { Form } from "@components/common/form/Form";
import { Field } from "@components/common/form/Field";
import Filter from "@components/common/list/Filter";
import { _ } from "@evershop/evershop/src/lib/locale/translate";

function Actions({ products = [], selectedIds = [] }) {
  const { openAlert, closeAlert } = useAlertContext();
  const [isLoading, setIsLoading] = useState(false);

  const updateProducts = async (status) => {
    setIsLoading(true);
    const promises = products
      .filter((product) => selectedIds.includes(product.uuid))
      .map((product) => axios.patch(product.updateApi, { status }));
    await Promise.all(promises);
    setIsLoading(false);
    window.location.reload();
  };

  const deleteProducts = async () => {
    setIsLoading(true);
    const promises = products
      .filter((product) => selectedIds.includes(product.uuid))
      .map((product) => axios.delete(product.deleteApi));
    await Promise.all(promises);
    setIsLoading(false);
    window.location.reload();
  };

  const actions = [
    {
      name: _("Disable"),
      onAction: () => {
        openAlert({
          heading: `${_("Disable")} ${selectedIds.length} ${_("products")}`,
          content: _("Are you sure?"),
          primaryAction: {
            title: _("Cancel"),
            onAction: closeAlert,
            variant: "primary",
          },
          secondaryAction: {
            title: _("Disable"),
            onAction: async () => {
              await updateProducts(0);
            },
            variant: "critical",
            isLoading: false,
          },
        });
      },
    },
    {
      name: _("Enable"),
      onAction: () => {
        openAlert({
          heading: `${_("Enable")} ${selectedIds.length} ${_("products")}`,
          content: _("Are you sure?"),
          primaryAction: {
            title: _("Cancel"),
            onAction: closeAlert,
            variant: "primary",
          },
          secondaryAction: {
            title: _("Enable"),
            onAction: async () => {
              await updateProducts(1);
            },
            variant: "critical",
            isLoading: false,
          },
        });
      },
    },
    {
      name: _("Delete"),
      onAction: () => {
        openAlert({
          heading: `${_("Delete")} ${selectedIds.length} ${_("products")}`,
          content: <div>{_("Can't be undone")}</div>,
          primaryAction: {
            title: _("Cancel"),
            onAction: closeAlert,
            variant: "primary",
          },
          secondaryAction: {
            title: _("Delete"),
            onAction: async () => {
              await deleteProducts();
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
      {selectedIds.length > 0 && (
        <td style={{ borderTop: 0 }} colSpan="100">
          <div className="inline-flex border border-divider rounded justify-items-start">
            <a href="#" className="font-semibold pt-3 pb-3 pl-6 pr-6">
              {selectedIds.length} {_("selected")}
            </a>
            {actions.map((action, i) => (
              <a
                key={i}
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
  products: PropTypes.arrayOf(
    PropTypes.shape({
      uuid: PropTypes.string.isRequired,
      updateApi: PropTypes.string.isRequired,
      deleteApi: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default function ProductGrid({
  productsBusiness: { items: products, total, currentFilters = [] },
}) {
  const [currentProducts, setCurrentProducts] = useState(products);

  useEffect(() => {
    const business = window.localStorage.getItem("business");

    const url = new URL(document.location);
    const filter = url.searchParams.get("name") ?? "";

    const ob = url.searchParams.get("ob");
    const od = url.searchParams.get("od");
    const lob = window.localStorage.getItem("ob");
    const lod = window.localStorage.getItem("od");

    if (ob) {
      window.localStorage.setItem("ob", ob);
    }
    if (od) {
      window.localStorage.setItem("od", od);
    }

    if (!ob && !od && (lob || lod)) {
      url.searchParams.set("ob", lob);
      url.searchParams.set("od", lod);
      window.location.href = url.href;
    }

    var businessVal = url.searchParams.get("business[value]");

    console.log(business);

    if (business && business !== businessVal) {
      url.searchParams.set("business[value]", business);
      url.searchParams.set("business[operation]", "eq");
      window.location.href = url.href;
    }

    if(!business && businessVal) {
      url.searchParams.delete("business[value]");
      url.searchParams.delete("business[operation]");
      window.location.href = url.href;
    }

    setCurrentProducts(
      products.filter((c) =>
        c?.name?.toLowerCase().includes(filter?.toLowerCase())
      )
    );
  }, []);

  const page = currentFilters.find((f) => f.key === "page")
    ? parseInt(currentFilters.find((f) => f.key === "page").value, 10)
    : 1;

  const limit = currentFilters.find((f) => f.key === "limit")
    ? parseInt(currentFilters.find((f) => f.key === "limit").value, 10)
    : 20;

  const [selectedRows, setSelectedRows] = useState([]);

  return (
    <Card>
      <Card.Session
        title={
          <Form submitBtn={false} id="productGridFilter">
            <div className="flex gap-8 justify-center items-center">
              <Area
                id="productGridFilter"
                noOuter
                coreComponents={[
                  {
                    component: {
                      default: () => (
                        <Field
                          name="keyword"
                          type="text"
                          id="keyword"
                          placeholder={_("Search")}
                          value={
                            currentFilters.find((f) => f.key === "keyword")
                              ?.value
                          }
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              const url = new URL(document.location);
                              const keyword =
                                document.getElementById("keyword")?.value;

                              if (keyword) {
                                // Set keyword filter
                                url.searchParams.set("name[value]", keyword);
                                url.searchParams.set("name[operation]", "like");
                                // Elimina el filtro de categoría si existía
                                url.searchParams.delete("category");
                              } else {
                                url.searchParams.delete("name[value]");
                                url.searchParams.delete("name[operation]");
                              }

                              window.location.href = url.href; // recarga con el filtro aplicado
                            }
                          }}
                        />
                      ),
                    },
                    sortOrder: 5,
                  },
                ]}
              />

              {/* <select
                className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-lg font-medium text-gray-700 shadow-sm focus:border-gray-400 focus:ring-2 focus:ring-gray-300 focus:outline-none"
                onChange={(e) => {
                  const url = new URL(document.location);
                  const category = e.target.value;

                  if (category) {
                    url.searchParams.set("category", category);
                    // Elimina el filtro de búsqueda si existía
                    url.searchParams.delete("name[value]");
                    url.searchParams.delete("name[operation]");
                  } else {
                    url.searchParams.delete("category");
                  }

                  window.location.href = url.href; // recarga con el filtro aplicado
                }}
                value={category}
              >
                <option value="">Todas las categorías</option>
                {currentProducts?.map((p) => p?.category).map((c, index) => (
                  <option value={c} key={index}>
                    {c}
                  </option>
                ))}
              </select> */}
            </div>
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
                    setSelectedRows(products.map((p) => p.uuid));
                  } else {
                    setSelectedRows([]);
                  }
                }}
              />
            </th>
            <Area
              id="productGridHeader"
              noOuter
              coreComponents={[
                {
                  component: {
                    default: () => <DummyColumnHeader title={_("Thumbnail")} />,
                  },
                  sortOrder: 5,
                },
                {
                  component: {
                    default: () => (
                      <SortableHeader
                        title={_("Name")}
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
                        title={_("Price")}
                        name="price"
                        currentFilters={currentFilters}
                      />
                    ),
                  },
                  sortOrder: 15,
                },
                {
                  component: {
                    default: () => <DummyColumnHeader title={_("Categoria")} />,
                  },
                  sortOrder: 20,
                },
                {
                  component: {
                    default: () => (
                      <SortableHeader
                        title={_("Stock")}
                        name="qty"
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
                        title={_("Status")}
                        name="status"
                        currentFilters={currentFilters}
                      />
                    ),
                  },
                  sortOrder: 30,
                },
                {
                  component: {
                    default: () => (
                      <SortableHeader
                        title={_("Priority")}
                        name="priority"
                        currentFilters={currentFilters}
                      />
                    ),
                  },
                  sortOrder: 35,
                },
              ]}
            />
          </tr>
        </thead>
        <tbody>
          <Actions products={products} selectedIds={selectedRows} />
          {currentProducts.map((p) => (
            <tr key={p.uuid}>
              <td>
                <Checkbox
                  isChecked={selectedRows.includes(p.uuid)}
                  onChange={(e) => {
                    if (e.target.checked)
                      setSelectedRows([...selectedRows, p.uuid]);
                    else
                      setSelectedRows(
                        selectedRows.filter((row) => row !== p.uuid)
                      );
                  }}
                />
              </td>
              <Area
                id="productGridRow"
                row={p}
                noOuter
                selectedRows={selectedRows}
                setSelectedRows={setSelectedRows}
                coreComponents={[
                  {
                    component: {
                      default: () => (
                        <ThumbnailRow
                          src={p.image?.thumb ?? ""}
                          name={p.name}
                        />
                      ),
                    },
                    sortOrder: 5,
                  },
                  {
                    component: {
                      default: () => (
                        <ProductNameRow
                          id="name"
                          name={p.name}
                          url={p.editUrl}
                        />
                      ),
                    },
                    sortOrder: 10,
                  },
                  {
                    component: {
                      default: ({ areaProps }) => (
                        <ProductPriceRow areaProps={areaProps} />
                      ),
                    },
                    sortOrder: 15,
                  },
                  {
                    component: {
                      default: () => (
                        <td>
                          {p?.category?.path?.map((p) => p.name).join(" > ") ||
                            "Sin categorías"}
                        </td>
                      ),
                    },
                    sortOrder: 20,
                  },
                  {
                    component: {
                      default: () => <QtyRow qty={p.inventory?.qty} />,
                    },
                    sortOrder: 25,
                  },
                  {
                    component: {
                      default: ({ areaProps }) => (
                        <StatusRow id="status" areaProps={areaProps} />
                      ),
                    },
                    sortOrder: 30,
                  },
                  {
                    component: {
                      default: () => <td>{p.priority}</td>,
                    },
                    sortOrder: 35,
                  },
                ]}
              />
            </tr>
          ))}
        </tbody>
      </table>
      {currentProducts.length === 0 && (
        <div className="flex w-full justify-center">
          {_("There is no product to display")}
        </div>
      )}
      <Pagination total={total} limit={limit} page={page} />
    </Card>
  );
}

ProductGrid.propTypes = {
  products: PropTypes.shape({
    items: PropTypes.arrayOf(
      PropTypes.shape({
        productId: PropTypes.number,
        uuid: PropTypes.string,
        name: PropTypes.string,
        image: PropTypes.shape({ thumb: PropTypes.string }),
        sku: PropTypes.string,
        status: PropTypes.number,
        inventory: PropTypes.shape({ qty: PropTypes.number }),
        price: PropTypes.shape({
          regular: PropTypes.shape({
            value: PropTypes.number,
            text: PropTypes.string,
          }),
        }),
        editUrl: PropTypes.string,
        updateApi: PropTypes.string,
        deleteApi: PropTypes.string,
      })
    ),
    total: PropTypes.number,
    currentFilters: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string,
        operation: PropTypes.string,
        value: PropTypes.string,
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
    productsBusiness (filters: $filters) {
      items {
        productId
        uuid
        name
        image {
          thumb
        }
        priority
        category {
          path {
            name
          }
        }
        sku
        status
        inventory {
          qty
        }
        price {
          regular {
            value
            text
          }
        }
        editUrl
        updateApi
        deleteApi
      }
      total
      currentFilters {
        key
        operation
        value
      }
    }
    newProductUrl: url(routeId: "productNew")
  }
`;

export const variables = `
{
  filters: getContextValue('filtersFromUrl')
}`;

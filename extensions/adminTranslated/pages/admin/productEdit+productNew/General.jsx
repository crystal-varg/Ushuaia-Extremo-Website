import PropTypes from "prop-types";
import React from "react";
import { useQuery } from "urql";
import Area from "@components/common/Area";
import { Field } from "@components/common/form/Field";
import { Card } from "@components/admin/cms/Card";
import Editor from "@components/common/form/fields/Editor";
import { useModal } from "@components/common/modal/useModal";
import CategorySelector from "@components/admin/promotion/couponEdit/CategorySelector";
import { _ } from "@evershop/evershop/src/lib/locale/translate";
import { useFormContext } from "@components/common/form/Form";

function SKUPriceWeight({ sku, price, weight, setting, priority }) {
  return (
    <div className="grid grid-cols-3 gap-4 mt-6">
      <div>
        <Field
          id="sku"
          name="sku"
          value={sku}
          placeholder={_("SKU")}
          label={_("SKU")}
          type="text"
        />
      </div>
      <div>
        <Field
          id="price"
          name="price"
          value={price?.value ?? 0}
          placeholder={_("Price")}
          label={_("Price")}
          type="text"
          validationRules={["notEmpty"]}
          suffix={setting.storeCurrency}
        />
      </div>
      <div>
        <Field
          id="priority"
          name="priority"
          value={priority ?? 5}
          placeholder={_("Priority")}
          label={_("Priority")}
          type="text"
        />
      </div>
      <div className="hidden">
        <Field
          id="weight"
          name="weight"
          value={weight?.value ?? 0}
          placeholder={_("Weight")}
          label={_("Weight")}
          type="text"
          suffix={setting.weightUnit}
        />
      </div>
    </div>
  );
}

SKUPriceWeight.propTypes = {
  price: PropTypes.shape({
    value: PropTypes.number,
  }),
  sku: PropTypes.string,
  weight: PropTypes.shape({
    value: PropTypes.number,
  }),
  setting: PropTypes.shape({
    storeCurrency: PropTypes.string,
    weightUnit: PropTypes.string,
  }).isRequired,
};

SKUPriceWeight.defaultProps = {
  price: undefined,
  sku: undefined,
  weight: undefined,
};

const CategoryQuery = `
  query Query ($id: Int!) {
    category(id: $id) {
      name
      path {
        name
      }
    }
  }
`;

function ProductCategory({ categoryId, onChange, onUnassign }) {
  const [result] = useQuery({
    query: CategoryQuery,
    variables: {
      id: parseInt(categoryId, 10),
    },
  });
  const { data, fetching, error } = result;
  if (error) {
    return (
      <p className="text-critical">
        {_("There was an error fetching categories.")}
        {error.message}
      </p>
    );
  }
  if (fetching) {
    return <span>{_("Loading...")}</span>;
  }
  return (
    <div>
      {data.category.path.map((item, index) => (
        <span key={item.name} className="text-gray-500">
          {item.name}
          {index < data.category.path.length - 1 && " > "}
        </span>
      ))}
      <span className="text-interactive pl-8">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onChange();
          }}
        >
          {_("Change")}
        </a>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onUnassign();
          }}
          className="text-critical ml-8"
        >
          {_("Unassign")}
        </a>
      </span>
    </div>
  );
}

ProductCategory.propTypes = {
  categoryId: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  onUnassign: PropTypes.func.isRequired,
};

function CategorySelect({ product }) {
  const [category, setCategory] = React.useState(
    product ? product.category?.categoryId : null
  );
  const modal = useModal();

  const closeModal = () => {
    modal.closeModal();
  };

  const onSelect = (categoryID) => {
    setCategory(categoryID);
    closeModal();
  };

  return (
    <div className="mt-6 relative">
      <div className="mb-4">{_("Category")}</div>
      {category && (
        <div className="border rounded border-[#c9cccf] mb-4 p-4">
          <ProductCategory
            categoryId={category}
            onChange={() => modal.openModal()}
            onUnassign={() => setCategory(null)}
          />
        </div>
      )}
      {!category && (
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            modal.openModal();
          }}
          className="text-interactive"
        >
          {_("Select category")}
        </a>
      )}
      {modal.state.showing && (
        <div className={modal.className} onAnimationEnd={modal.onAnimationEnd}>
          <div
            className="modal-wrapper flex self-center justify-center items-center"
            tabIndex={-1}
            role="dialog"
          >
            <div className="modal">
              <CategorySelector
                onSelect={onSelect}
                onUnSelect={() => {}}
                selectedIDs={category ? [category] : []}
                closeModal={closeModal}
              />
            </div>
          </div>
        </div>
      )}
      {category && <input type="hidden" name="category_id" value={category} />}
      {!category && <input type="hidden" name="category_id" value="" />}
    </div>
  );
}

CategorySelect.propTypes = {
  product: PropTypes.shape({
    category: PropTypes.shape({
      categoryId: PropTypes.number.isRequired,
      name: PropTypes.string,
      path: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
        })
      ).isRequired,
    }),
  }),
};

CategorySelect.defaultProps = {
  product: {
    category: {},
  },
};

export default function General({
  product,
  browserApi,
  deleteApi,
  uploadApi,
  folderCreateApi,
  setting,
  productTaxClasses: { items: taxClasses },
}) {
  const { fields: formFields } = useFormContext();
  return (
    <Card title={_("General")}>
      <Card.Session>
        <Area
          id="productEditGeneral"
          coreComponents={[
            {
              component: { default: Field },
              props: {
                id: "name",
                name: "name",
                label: _("Name"),
                value: product?.name,
                validationRules: ["notEmpty"],
                type: "text",
                placeholder: _("Name"),
              },
              sortOrder: 10,
              id: "name",
            },
            {
              component: { default: Field },
              props: {
                id: "product_id",
                name: "product_id",
                value: product?.productId,
                type: "hidden",
              },
              sortOrder: 10,
              id: "product_id",
            },
            {
              component: { default: SKUPriceWeight },
              props: {
                sku: product?.sku,
                price: product?.price.regular,
                weight: product?.weight,
                priority: product?.priority,
                setting,
              },
              sortOrder: 20,
              id: "SKUPriceWeight",
            },
            {
              component: { default: CategorySelect },
              props: {
                product,
              },
              sortOrder: 22,
              id: "category",
            },
            // {
            //   component: { default: Field },
            //   props: {
            //     id: 'tax_class',
            //     name: 'tax_class',
            //     value: product?.taxClass || '',
            //     type: 'select',
            //     label: _('Tax class'),
            //     options: [...taxClasses],
            //     placeholder: 'None',
            //     disableDefaultOption: false
            //   },
            //   sortOrder: 25,
            //   id: 'tax_class'
            // },
            {
              component: { default: Editor },
              props: {
                id: "description",
                name: "description",
                label: _("Description"),
                value: product?.description,
                browserApi,
                deleteApi,
                uploadApi,
                folderCreateApi,
              },
              sortOrder: 30,
              id: "description",
            },
          ]}
        />
      </Card.Session>
    </Card>
  );
}

General.propTypes = {
  browserApi: PropTypes.string.isRequired,
  deleteApi: PropTypes.string.isRequired,
  folderCreateApi: PropTypes.string.isRequired,
  uploadApi: PropTypes.string.isRequired,
  product: PropTypes.shape({
    description: PropTypes.arrayOf(
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
    name: PropTypes.string,
    price: PropTypes.shape({
      regular: PropTypes.shape({
        currency: PropTypes.string,
        value: PropTypes.number,
      }),
    }),
    productId: PropTypes.number,
    taxClass: PropTypes.number,
    sku: PropTypes.string,
    weight: PropTypes.shape({
      unit: PropTypes.string,
      value: PropTypes.number,
    }),
  }),
  setting: PropTypes.shape({
    storeCurrency: PropTypes.string,
    weightUnit: PropTypes.string,
  }).isRequired,
  productTaxClasses: PropTypes.shape({
    items: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.number,
        text: PropTypes.string,
      })
    ),
  }),
};

General.defaultProps = {
  product: undefined,
  productTaxClasses: {
    items: [],
  },
};

export const layout = {
  areaId: "leftSide",
  sortOrder: 10,
};

export const query = `
  query Query {
    product(id: getContextValue("productId", null)) {
      productId
      name
      description
      sku
      taxClass
      priority
      price {
        regular {
          value
          currency
        }
      }
      weight {
        value
        unit
      }
      category {
        categoryId
        path {
          name
        }
      }
    }
    setting {
      weightUnit
      storeCurrency
    }
    browserApi: url(routeId: "fileBrowser", params: [{key: "0", value: ""}])
    deleteApi: url(routeId: "fileDelete", params: [{key: "0", value: ""}])
    uploadApi: url(routeId: "imageUpload", params: [{key: "0", value: ""}])
    folderCreateApi: url(routeId: "folderCreate")
    productTaxClasses: taxClasses {
      items {
        value: taxClassId
        text: name
      }
    }
  }
`;

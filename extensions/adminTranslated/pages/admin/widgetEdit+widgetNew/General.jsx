import PropTypes from "prop-types";
import React from "react";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import { Field } from "@components/common/form/Field";
import { Card } from "@components/admin/cms/Card";
import { _ } from "@evershop/evershop/src/lib/locale/translate";

const components = {
  DropdownIndicator: null,
};

const createOption = (label) => ({
  label,
  value: label,
});

function AreaInput({ values }) {
  const [inputValue, setInputValue] = React.useState("");
  const [value, setValue] = React.useState(values);

  const handleKeyDown = (event) => {
    if (!inputValue) return;
    switch (event.key) {
      case "Enter":
      case "Tab":
        setValue((prev) => [...prev, createOption(inputValue)]);
        setInputValue("");
        event.preventDefault();
        break;
      default:
        break;
    }
  };

  return (
    <CreatableSelect
      components={components}
      inputValue={inputValue}
      name="area[]"
      isClearable
      isMulti
      menuIsOpen={false}
      onChange={(newValue) => {
        setValue(newValue);
      }}
      onInputChange={(newValue) => setInputValue(newValue)}
      onKeyDown={handleKeyDown}
      placeholder={_("Type area and press enter...")}
      value={value}
    />
  );
}

AreaInput.propTypes = {
  values: PropTypes.arrayOf(
    PropTypes.shape({ label: PropTypes.string, value: PropTypes.string })
  ),
};

AreaInput.defaultProps = {
  values: [],
};

export default function General({ widget, routes }) {
  const allRoutes = [
    {
      value: "all",
      label: _("All"),
      isAdmin: false,
      isApi: false,
      method: ["GET"],
    },
    ...routes,
  ];
  return (
    <Card>
      <Card.Session title={_("Name")}>
        <Field
          type="text"
          name="name"
          value={widget?.name}
          placeholder={_("Name")}
          validationRules={["notEmpty"]}
        />
      </Card.Session>
      <Card.Session title={_("Status")}>
        <Field
          type="radio"
          name="status"
          options={[
            { value: 0, text: _("Disabled") },
            { value: 1, text: _("Enabled") },
          ]}
          value={widget ? widget.status : 1}
        />
      </Card.Session>
      <Card.Session title={_("Area")}>
        <AreaInput
          values={
            widget?.area?.length > 0
              ? widget.area.map((a) => ({ value: a, label: a }))
              : []
          }
        />
      </Card.Session>
      <Card.Session title={_("Page")}>
        <Select
          name="route[]"
          options={allRoutes.filter(
            (r) =>
              r.isApi === false &&
              r.isAdmin === false &&
              r.method.includes("GET") &&
              r.method.length === 1
          )}
          hideSelectedOptions
          isMulti
          aria-label={_("Select country")}
          defaultValue={
            widget?.route
              ? allRoutes.filter((r) => widget.route.includes(r.value))
              : []
          }
          className="page-select relative z-50"
        />
      </Card.Session>
      <Card.Session title={_("Sort order")}>
        <Field
          type="text"
          name="sort_order"
          value={widget?.sortOrder}
          placeholder={_("Sort order")}
          validationRules={["notEmpty", "number"]}
        />
      </Card.Session>
    </Card>
  );
}

General.propTypes = {
  widget: PropTypes.shape({
    status: PropTypes.number,
    name: PropTypes.string.isRequired,
    sortOrder: PropTypes.number,
    area: PropTypes.string,
    route: PropTypes.string,
  }),
  routes: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
      isApi: PropTypes.bool,
      isAdmin: PropTypes.bool,
      method: PropTypes.arrayOf(PropTypes.string),
    })
  ).isRequired,
};

General.defaultProps = {
  widget: null,
};

export const layout = {
  areaId: "rightSide",
  sortOrder: 15,
};

export const query = `
  query Query {
    widget(id: getContextValue("widgetId", null)) {
      name
      status
      sortOrder
      area
      route
    }
    routes {
      value: id
      label: name
      isApi
      isAdmin
      method
    }
  }
`;

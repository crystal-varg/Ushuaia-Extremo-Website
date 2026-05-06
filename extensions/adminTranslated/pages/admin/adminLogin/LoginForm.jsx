import PropTypes from "prop-types";
import React from "react";
import { Field } from "@components/common/form/Field";
import { Form } from "@components/common/form/Form";
import "./LoginForm.scss";
import Area from "@components/common/Area";
import { _ } from '@evershop/evershop/src/lib/locale/translate';

export default function LoginForm({ authUrl, dashboardUrl }) {
  const [error, setError] = React.useState(null);

  const onSuccess = (response) => {
    if (!response.error) {
      window.location.href = dashboardUrl;
    } else {
      setError(response.error.message);
    }
  };

  return (
    <div className="admin-login-form">
      <div className="flex items-center justify-center mb-12">
        <a href="/">
          <img src="/images/logo-UE.png" alt="ue-logo" className="h-[96px]" />
        </a>
      </div>
      {error && <div className="text-critical py-4">{error}</div>}
      <Form
        action={authUrl}
        method="POST"
        id="adminLoginForm"
        isJSON
        onSuccess={onSuccess}
        btnText={_('Login')}
      >
        <Area
          id="adminLoginForm"
          coreComponents={[
            {
              component: {
                default: Field,
              },
              props: {
                name: "email",
                type: "email",
                label: "Email",
                placeholder: "Email",
                validationRules: ["notEmpty", "email"],
              },
              sortOrder: 10,
            },
            {
              component: {
                default: Field,
              },
              props: {
                name: "password",
                type: "password",
                label: _("Password"),
                placeholder: _("Password"),
                validationRules: ["notEmpty"],
              },
              sortOrder: 20,
            },
          ]}
          noOuter
        />
      </Form>
    </div>
  );
}

LoginForm.propTypes = {
  authUrl: PropTypes.string.isRequired,
  dashboardUrl: PropTypes.string.isRequired,
};

export const layout = {
  areaId: "content",
  sortOrder: 10,
};

export const query = `
  query Query {
    authUrl: url(routeId: "adminLoginJson")
    dashboardUrl: url(routeId: "dashboard")
  }
`;

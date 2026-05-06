import React from 'react';
import PropTypes from 'prop-types';
import { _ } from '@evershop/evershop/src/lib/locale/translate';

export default function Version({ version }) {
  return (
    <div className="version">
      <span>{_("Version")} {version}</span>
    </div>
  );
}

Version.propTypes = {
  version: PropTypes.string.isRequired
};

export const layout = {
  areaId: 'footerLeft',
  sortOrder: 20
};

export const query = `
  query query {
    version
  }
`;

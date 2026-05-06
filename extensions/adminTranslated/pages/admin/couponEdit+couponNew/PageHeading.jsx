import PropTypes from "prop-types";
import React from "react";
import PageHeading from "@components/admin/cms/PageHeading";
import { _ } from "@evershop/evershop/src/lib/locale/translate";

export default function CouponEditPageHeading({ backUrl, coupon }) {
  return (
    <PageHeading
      backUrl={backUrl}
      heading={
        coupon ? `${_("Editing")} ${coupon.coupon}` : _("Create a new coupon")
      }
    />
  );
}

CouponEditPageHeading.propTypes = {
  backUrl: PropTypes.string.isRequired,
  coupon: PropTypes.shape({
    coupon: PropTypes.string,
  }),
};

CouponEditPageHeading.defaultProps = {
  coupon: null,
};

export const layout = {
  areaId: "content",
  sortOrder: 5,
};

export const query = `
  query Query {
    coupon(id: getContextValue("couponId", null)) {
      coupon
    }
    backUrl: url(routeId: "couponGrid")
  }
`;

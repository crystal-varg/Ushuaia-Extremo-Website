import React, { useEffect, useState } from "react";
import Area from "@evershop/evershop/src/components/common/Area";

export default function ProductPageLayout() {
  const [excursion, setExcursion] = useState(false);

  useEffect(() => {
    if (window.location.pathname.startsWith("/excursion")) setExcursion(true);
  }, []);

  if (excursion) return <Area id="excursionView" />;

  return (
    <div className="product-detail">
      <Area id="productPageTop" className="product-page-top" />
      <div className="product-page-middle page-width">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          <Area id="productPageMiddleLeft" />
          <Area id="productPageMiddleRight" />
        </div>
      </div>
      <Area id="productPageBottom" className="product-page-top" />
    </div>
  );
}

export const layout = {
  areaId: "content",
  sortOrder: 10,
};

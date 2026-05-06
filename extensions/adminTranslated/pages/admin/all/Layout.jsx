import React, { useEffect } from "react";
import Area from "@components/common/Area";
import "./Layout.scss";
import "./tailwind.scss";

export default function AdminLayout() {
  useEffect(() => {
    window.addEventListener("beforeunload", (event) => {
      if (window.formDirty) {
        event.preventDefault();
        event.returnValue = "ASD";
      }
    });
    return () => {
      window.removeEventListener("beforeunload", () => {});
    };
  }, []);

  return (
    <>
      <div className="header">
        <Area id="header" noOuter />
      </div>
      <div className="content-wrapper">
        <div className="admin-navigation">
          <Area id="adminNavigation" noOuter />
        </div>
        <div className="main-content">
          <Area id="content" className="main-content-inner" />
          <div className="footer flex justify-between">
            <Area id="footerLeft" className="footer-left" />
            <Area id="footerRight" className="footer-right" />
          </div>
        </div>
      </div>
    </>
  );
}

export const layout = {
  areaId: "body",
  sortOrder: 10,
};

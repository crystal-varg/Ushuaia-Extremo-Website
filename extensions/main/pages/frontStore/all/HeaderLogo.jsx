import React, { useState } from "react";
import "./global.css";

export default function HeaderLogo() {
  return (
    <a href="/" className="lg:flex hidden items-center">
      <div className="flex flex-row h-fit items-center">
        <span className="h-fit">
          <img src="/images/logo.svg" alt="UE logo" />
        </span>
      </div>
    </a>
  );
}

export const layout = {
  areaId: "header",
  sortOrder: 1,
};

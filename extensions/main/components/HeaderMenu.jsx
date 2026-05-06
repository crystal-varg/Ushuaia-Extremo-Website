import { _ } from "@evershop/evershop/src/lib/locale/translate";
import React from "react";

export default function HeaderMenu() {
  return (
    <div
      className="hidden lg:flex flex-row items-end h-[50px] w-full"
      style={{ fontFamily: "Monumental" }}
    >
      <div className="flex flex-row items-end justify-between h-full w-full">
        <HeaderButton url="/" text={_("Home").toUpperCase()} />
        <HeaderButton url="/excursiones?promos=1" text={_("Promociones").toUpperCase()} />
        <HeaderButton url="/excursiones" text={_("Excursiones").toUpperCase()} />
        <HeaderButton url="/rental" text={_("Rental").toUpperCase()} />
        <HeaderButton url="/tienda/bicicletas" text={_("Bicicleteria").toUpperCase()} />
        <HeaderButton url="/page/aboutus" text={_("Quienes Somos").toUpperCase()} />
        <HeaderButton url="/page/tarifario" text={_("Tarifario").toUpperCase()} />
        <HeaderButton url="/blog?limit=12" text={_("Blog").toUpperCase()} />
        <HeaderButton url="/page/faq" text={_("FAQ").toUpperCase()} />
        <HeaderButton url="/contacto" text={_("Contact").toUpperCase()} />
      </div>
    </div>
  );
}

function HeaderButton({ text, url }) {
  return (
    <a
      href={url}
      className="text-[12px] text-[#EB001B] hover:underline cursor-pointer select-none font-bold"
    >
      {text}
    </a>
  );
}

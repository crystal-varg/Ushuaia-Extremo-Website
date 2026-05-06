import React, { useState } from "react";
import { _ } from "@evershop/evershop/src/lib/locale/translate";
import SearchIcon from "@components/SearchIcon";
import HeaderMenu from "@components/HeaderMenu";
import Bag from "@heroicons/react/outline/ShoppingBagIcon";

export default function SubHeader() {
  const [keyword, setKeyword] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState(false);

  const goToSearch = () => {
    if (keyword && keyword == "") return;
    const url = new URL("/search", window.location.origin);
    url.searchParams.set("keyword", keyword);

    window.location.href = url;
  };

  const menuItems = [
    {
      text: "Home",
      url: "/",
    },
    {
      text: "Excursiones",
      url: "/excursiones",
    },
    {
      text: "Rental",
      url: "/rental",
    },
    {
      text: "Bicicleteria",
      url: "/tienda",
    },
    {
      text: "Quienes Somos",
      url: "/page/aboutus",
    },
    {
      text: "Tarifario",
      url: "/page/tarifario",
    },
    {
      text: "Blog",
      url: "/blog?limit=12",
    },
    {
      text: "FAQ",
      url: "/page/faq",
    },
    {
      text: "Contacto",
      url: "/contacto",
    },
  ];

  return (
    <>
      <div className="flex lg:px-10 lg:col-span-11 col-span-12 w-full h-full flex-col">
        <div
          className="fixed top-0 -left-full h-full w-2/5 bg-red-600 transition-all pt-14 z-30"
          style={{
            left: !menuOpen ? "-100%" : "0",
          }}
        >
          <img
            src="/icons/CrossIcon.png"
            className="ml-4"
            onClick={() => setMenuOpen(false)}
          ></img>
          <div className="mt-5">
            {menuItems.map((item, i) => (
              <div
                onClick={() => (window.location.href = item.url)}
                key={`mobileMenuItem${i}`}
                className="w-full p-2 border border-white text-white zuume"
              >
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-12 lg:flex flex-row justify-between">
          <div className="col-span-3 flex lg:hidden">
            <img
              src="/icons/Burguer.png"
              className="my-auto"
              onClick={() => setMenuOpen(true)}
            ></img>
          </div>
          <div className="absolute top-4 left-1/2 lg:hidden">
            <img
              className="-translate-x-1/2 h-10 "
              src="/images/logo-UE.png"
              alt="UE logo"
            />
          </div>
          <div className="flex justify-center lg:hidden max-sm:col-span-6 max-md:col-span-7 col-span-8">
            {/* <img className="h-10 " src="/images/logo-UE.png" alt="UE logo" /> */}
          </div>

          <div className="w-fit lg:w-full flex flex-row col-span-1 items-end">
            <SearchIcon className="mx-1 pc cursor-pointer hidden lg:block" onClick={goToSearch} />
            <SearchIcon className="mx-1 phone cursor-pointer block lg:hidden" onClick={() => setSearch(!search)} />
            <div className="w-1/3 hidden lg:block">
              <div className="rounded-full border-[rgb(54,54,54,0.5)] border-solid border h-8 flex align-middle items-center">
                <input
                  style={{ marginLeft: "-8px" }}
                  className="p-0 m-0 h-1 w-full text-lg"
                  placeholder={_("Search Product")}
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  type="text"
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      goToSearch();
                    }
                  }}
                />
              </div>
            </div>
            <div
              className="flex flex-row w-fit ml-auto"
              style={{ fontFamily: "Monumental" }}
            >
              <MenuButton url="/cart" text={_("My Cart")}>
                <Bag width={40} height={30}></Bag>
              </MenuButton>
            </div>
          </div>
        </div>

        <HeaderMenu />
      </div>
      {search && (
        <div className="flex lg:px-10 lg:col-span-11 col-span-12 w-full h-full flex-col mt-5">
          <div className="w-full px-20 max-sm:px-2 lg:w-full flex flex-row col-span-1 items-end">
            <div className="w-full">
              <div className="rounded-full border-[rgb(54,54,54,0.5)] border-solid border h-8 flex align-middle items-center">
                <input
                  style={{ marginLeft: "-8px" }}
                  className="p-0 m-0 h-1 w-full text-lg"
                  placeholder={_("Search Product")}
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  type="text"
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      goToSearch();
                    }
                  }}
                />
              </div>
            </div>
            <SearchIcon className="mx-1 cursor-pointer" onClick={goToSearch} />
          </div>
        </div>
      )}
    </>
  );
}

export const layout = {
  areaId: "header",
  sortOrder: 1,
};

function MenuButton({ text, url, children }) {
  return (
    <a href={url} className="flex flex-row text-sm w-fit items-center mx-1">
      {children}
      <p className="hidden lg:block whitespace-nowrap">{text}</p>
    </a>
  );
}

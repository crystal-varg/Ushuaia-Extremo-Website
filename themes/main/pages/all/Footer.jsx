import React from "react";

export default function Footer() {
  return (
    <div
      id="contact"
      className="w-full h-fit pt-10 lg:px-32"
      style={{
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundImage: "url('/images/Footer/Background.png')",
      }}
    >
      <div className="w-full h-full flex md:flex-row flex-col justify-evenly">
        <div className="mb-10 flex flex-col">
          <div className="flex flex-row text-center mx-auto w-fit justify-center">
            <img className="w-16 mr-3 h-16" src="/images/logo-UE.png" />
            <p
              className="font-bold text-5xl mt-2"
              style={{ fontFamily: "zuume" }}
            >
              Ushuaia Extremo
            </p>
          </div>
          <div className="w-full flex flex-row justify-between mt-2 max-w-xs mx-auto">
            <a
              target="_blank"
              rel="noreferrer"
              href="https://www.youtube.com/@ushuaiaextremotravels6036"
            >
              <img src="/icons/YouTube.svg" width={32} height={32}></img>
            </a>
            <a
              href="https://www.facebook.com/ushuaiaextremo"
              target="_blank"
              rel="noreferrer"
            >
              <img src="/icons/facebook.svg" width={32} height={32}></img>
            </a>
            <a
              href="https://www.tripadvisor.com/Attraction_Review-g312855-d10954317-Reviews-Ushuaia_Extremo-Ushuaia_Province_of_Tierra_del_Fuego_Patagonia.html"
              target="_blank"
              rel="noreferrer"
            >
              <img src="/icons/TripAdvisor.svg" width={32} height={32}></img>
            </a>
          </div>
        </div>

        <div className="text-justify monumental text-base font-bold mx-10 text-[9px] md:text-[13px] lg:text-[15px]">
          <p className="mb-5 flex items-center justify-between">
            <span className="text-red-600">RENTAL & BIKE</span>
            <a
              className="sm:hidden ml-auto mr-2"
              target="_blank"
              rel="noreferrer"
              href="https://wa.me/542901640089"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="icon icon-tabler icons-tabler-outline icon-tabler-brand-whatsapp"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M3 21l1.65 -3.8a9 9 0 1 1 3.4 2.9l-5.05 .9" />
                <path d="M9 10a.5 .5 0 0 0 1 0v-1a.5 .5 0 0 0 -1 0v1a5 5 0 0 0 5 5h1a.5 .5 0 0 0 0 -1h-1a.5 .5 0 0 0 0 1" />
              </svg>
            </a>
            <a
              className="max-sm:hidden ml-auto mr-2"
              target="_blank"
              rel="noreferrer"
              href="https://wa.me/542901640089"
            >
              +54 2901 640089
            </a>
            <a
              target="_blank"
              rel="noreferrer"
              href="https://www.instagram.com/ushuaia.extremo.outdoors"
            >
              <img src="/icons/Instagram.svg" width={32} height={32}></img>
            </a>
          </p>
          <p className="mb-5 flex items-center justify-between">
            <span className="text-red-600">TRAVELS</span>
            <a
              className="sm:hidden ml-auto mr-2"
              target="_blank"
              rel="noreferrer"
              href="https://wa.me/542901619587"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="icon icon-tabler icons-tabler-outline icon-tabler-brand-whatsapp"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M3 21l1.65 -3.8a9 9 0 1 1 3.4 2.9l-5.05 .9" />
                <path d="M9 10a.5 .5 0 0 0 1 0v-1a.5 .5 0 0 0 -1 0v1a5 5 0 0 0 5 5h1a.5 .5 0 0 0 0 -1h-1a.5 .5 0 0 0 0 1" />
              </svg>
            </a>
            <a
              className="max-sm:hidden ml-auto mr-2"
              target="_blank"
              rel="noreferrer"
              href="https://wa.me/542901619587"
            >
              +54 2901 619587{" "}
            </a>
            <a
              target="_blank"
              rel="noreferrer"
              href="https://www.instagram.com/ushuaiaextremo.travels"
            >
              <img src="/icons/Instagram.svg" width={32} height={32}></img>
            </a>
          </p>
          <a
            href="mailto:INFO@USHUAIAEXTREMOTRAVELS.COM"
            target="_blank"
            rel="noreferrer"
            className="mb-5 max-lg:break-all"
          >
            INFO@USHUAIAEXTREMOTRAVELS.COM
          </a>
        </div>
      </div>
      <div className="h-full flex flex-col text-center text-black/25">
        <span className="text-sm mt-auto" style={{ fontFamily: "Monumental" }}>
          <a href="/page/terms-and-conditions" className="mb-2 mt-6 block">
            Terminos y Condiciones
          </a>
          <a href="/page/privacy-policies">Politicas de Privacidad</a>
        </span>
      </div>
      <div className="w-full text-center text-xs monumental text-black/25 pb-3">
        © Copyright Ushuaia Extremo. All Rights Reserved.
      </div>
    </div>
  );
}

export const layout = {
  areaId: "footer",
  sortOrder: 1,
};
//<div>© Copyright Ushuaia Extremo. All Rights Reserved.</div>

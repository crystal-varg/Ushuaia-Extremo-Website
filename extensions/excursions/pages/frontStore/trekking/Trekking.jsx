import React from "react";
import X from "@heroicons/react/solid/esm/XIcon";
import Check from "@heroicons/react/solid/esm/CheckIcon";

export default function Trekking() {
  return (
    <div>
      <img src="/images/Excursions/Trekking/Banner.png"></img>
      <div className="mx-64 mt-4">
        <p className="text-5xl font-bold" style={{ fontFamily: "zuume" }}>
          TREKKING GLACIAR VINCIGUERRA
        </p>
        <img
          className="mt-10 w-full"
          src="/images/Excursions/Trekking/Main.jpg"
        ></img>
        <div className="grid grid-cols-12 mt-4 mb-5">
          <div className="col-span-8">
            <p className="monumental font-bold mb-2">Información General</p>
            <p className="monumental font-bold text-sm">
              Viví una aventura única hacia uno de los glaciares más impactantes
              de Ushuaia. La excursión comienza temprano, con pick-up en tu
              alojamiento. Nos dirigimos al Valle de Andorra, donde inicia el
              trekking desde la “Tranquera Verde”.
            </p>
            <div className="grid grid-cols-3 mt-6">
              <InfoIcon
                text1="Duración"
                text2="8 Horas"
                icon="/icons/Trekking/Duracion.png"
              />
              <InfoIcon
                text1="Guías"
                text2="Inglés, Portugués, Español"
                icon="/icons/Trekking/Guias.png"
              />
              <InfoIcon
                text1="Reservá Ahora"
                text2="Y pagá después"
                icon="/icons/Trekking/Reserva.png"
              />
            </div>
            <hr className="mt-6" />
            <div className="flex mt-4">
              <p className="monumental font-bold text-lg">Qué Incluye</p>
              <div className="px-20">
                <ul className="monumental font-bold text-lg [&>li]:p-3">
                  <ListWithIcon
                    ComponentType={X}
                    text={"Bebidas Alcoholicas"}
                    color={"red"}
                  />
                  <ListWithIcon
                    ComponentType={Check}
                    text={"Vianda premium y colación durante el recorrido"}
                    color={"green"}
                  />
                  <ListWithIcon
                    ComponentType={Check}
                    text={"Acceso a las cuevas de hielo (según condiciones)"}
                    color={"green"}
                  />
                  <ListWithIcon
                    ComponentType={Check}
                    text={"Bastones de trekking"}
                    color={"green"}
                  />
                  <ListWithIcon
                    ComponentType={Check}
                    text={"Guía especializado en trekking de montaña"}
                    color={"green"}
                  />
                  <ListWithIcon
                    ComponentType={Check}
                    text={"Traslado ida y vuelta desde tu alojamiento"}
                    color={"green"}
                  />
                </ul>
              </div>
            </div>
          </div>
          <div className="col-span-4 px-2">
            <div className="mt-20">
              <div className="h-9 w-full text-center bg-[#AAD3FF]">
                <p className="monumental text-white font-bold text-base pt-2">
                  Ahorra hasta un 11%
                </p>
              </div>
              <div className="border border-[#AAD3FF] rounded-sm w-full">
                <div className="grid grid-cols-2">
                  <div className="pl-10 py-10">
                    <p className="font-bold monumental text-sm">
                      Desde 250 USD
                    </p>
                    <p className="font-bold monumental text-base text-red-500">
                      200 USD
                    </p>
                  </div>
                  <div className="pr-10 pt-4">
                    <div className="h-11 w-full bg-[#0071EB] rounded-full text-center text-white monumental text-sm font-bold pt-3">
                      Reservá
                    </div>
                    <div className="h-11 w-full bg-[#0071EB] rounded-full text-center text-white monumental text-sm font-bold pt-3 mt-2">
                      Consultá
                    </div>
                  </div>
                </div>
                <p className="monumental text-xs px-10 py-5">
                  <span className="underline font-bold">
                    Reservar ahora y pagar después
                  </span>{" "}
                  te permite asegurarte una plaza, sin que se realice ningún
                  cargo hoy
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoIcon({ icon, text1, text2 }) {
  return (
    <div className="flex flex-row">
      <img className="h-full" src={icon}></img>
      <div className="px-2">
        <p className="monumental text-sm font-bold">{text1}</p>
        <p className="monumental mt-1 text-[10px] text-[#63687A]">{text2}</p>
      </div>
    </div>
  );
}

function ListWithIcon({ ComponentType, color, text }) {
  return (
    <li className="flex">
      <ComponentType className={"h-8 mr-2 text-" + color + "-500"} /> {text}
    </li>
  );
}

export const layout = {
  areaId: "content",
  sortOrder: 1,
};

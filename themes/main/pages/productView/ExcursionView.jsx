import Editor from "@components/common/Editor";
import React, { useState } from "react";
import X from "@heroicons/react/solid/esm/XIcon";
import Check from "@heroicons/react/solid/esm/CheckIcon";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import { toast } from "react-toastify";
import ProductForm from "./Form";

export default function ExcursionView({ product,action }) {
  const [contactModal, setContactModal] = useState(false);

  const season = product?.category?.path?.[1]?.name ?? "";
  const type = product?.category?.path?.[2]?.name ?? "";

  const subtitle =
    season && type ? `${season} | ${type}` : season ? season : "";

  let { attributes } = product;
  attributes = attributes.filter(
    (a) =>
      a.attributeCode != "includes" &&
      a.attributeCode != "notincludes" &&
      a.attributeCode != "subtitle" &&
      a.attributeCode != "link" &&
      a.attributeCode != "promo"
  );

  attributes = attributes.map((a) => {
    switch (a.attributeCode) {
      case "duration":
        return { ...a, img: "/images/Excursions/duration.png" };
      case "distance":
        return { ...a, img: "/images/Excursions/distance.png" };
      case "desnivel":
        return { ...a, img: "/images/Excursions/desnivel.png" };
      case "difficulty":
        return { ...a, img: "/images/Excursions/difficulty.png" };
    }
  });

  attributes = attributes.filter((a) => !!a);
  return (
    <div>
      <hr></hr>
      <div className="2xl:mx-[356px] mx-20 max-sm:mx-10 mt-4">
        <p className="text-5xl font-bold" style={{ fontFamily: "zuume" }}>
          {product.name}
        </p>
        <p className="monumental text-base font-bold text-[#AEB4B9]">
          {subtitle}
        </p>
        <div className="w-full">
          <div className="w-fit ml-auto mr-2">
            <svg
              className="w-fit ml-auto inline"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.17 3.51992L4.42 6.25992L3.24 5.07992L8 0.329923L12.76 5.07992L11.58 6.25992L8.83 3.51992V11.4699H7.17V3.51992ZM0.5 12.3399V9.83992H2.17V12.3399C2.17 12.6399 2.245 12.9183 2.395 13.1749C2.545 13.4316 2.74667 13.6349 3 13.7849C3.25333 13.9349 3.53 14.0099 3.83 14.0099H12.17C12.47 14.0099 12.7467 13.9349 13 13.7849C13.2533 13.6349 13.455 13.4316 13.605 13.1749C13.755 12.9183 13.83 12.6399 13.83 12.3399V9.83992H15.5V12.3399C15.5 12.7799 15.415 13.2049 15.245 13.6149C15.075 14.0249 14.8333 14.3866 14.52 14.6999C14.2067 15.0133 13.8467 15.2533 13.44 15.4199C13.0333 15.5866 12.61 15.6699 12.17 15.6699H3.83C3.23 15.6699 2.67 15.5199 2.15 15.2199C1.65 14.9266 1.25333 14.5266 0.96 14.0199C0.653333 13.4999 0.5 12.9399 0.5 12.3399Z"
                fill="#1A2B49"
              />
            </svg>
            <p
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast.info("Enlace copiado en portapapeles");
              }}
              className="inline w-fit ml-5 monumental underline text-sm cursor-pointer"
            >
              Compartir
            </p>
          </div>
        </div>
        <div className="grid grid-cols-12 mt-2 mb-5">
          <div className="col-span-8 max-xl:col-span-12">
            <div className="w-full h-fit flex justify-end items-end">
              <div className="absolute text-right pointer-events-none">
                <img
                  src="/images/imagesButton.png"
                  className="m-2 pointer-events-none"
                ></img>
              </div>
              <PhotoProvider>
                <PhotoView src={product?.image?.origin}>
                  <img
                    className="w-full object-cover h-[70vh] max-h-[600px] cursor-zoom-in"
                    src={product?.image?.origin}
                  ></img>
                </PhotoView>
              </PhotoProvider>
            </div>
            <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 mt-6 mx-auto">
              {attributes.map((a, i) => (
                <InfoIcon
                  key={i}
                  text1={a?.attributeName}
                  text2={a?.optionText}
                  icon={a?.img}
                />
              ))}
            </div>
            <p className="monumental font-extrabold text-base mt-10">
              INFORMACIÓN GENERAL
            </p>
            <span className="monumental text-sm">
              <Editor rows={product.description} />
            </span>
            <hr className="mt-6" />
            <div className="flex justify-between mt-4 max-md:flex-col">
              <div className="w-1/2">
                <p className="monumental font-bold text-lg">Qué Incluye</p>
                <div>
                  <ul className="monumental text-base [&>li]:p-3">
                    {product.attributes
                      .find((a) => a.attributeCode == "includes")
                      ?.optionText?.split(",")
                      ?.map((o, i) => (
                        <ListWithIcon
                          key={i}
                          ComponentType={Check}
                          text={o}
                          color={"green"}
                        />
                      ))}
                  </ul>
                </div>
              </div>
              <div className="w-1/2">
                <p className="monumental font-bold text-lg">Qué No Incluye</p>
                <ul className="monumental text-base [&>li]:p-3">
                  {product.attributes
                    .find((a) => a.attributeCode == "notincludes")
                    ?.optionText.split(",")
                    .map((o, i) => (
                      <ListWithIcon
                        key={i}
                        ComponentType={X}
                        text={o}
                        color={"red"}
                      />
                    ))}
                </ul>
              </div>
            </div>
            <hr></hr>
          </div>
          <div className="col-span-4 px-2 max-md:col-span-12 max-xl:mx-auto max-xl:mt-5 max-xl:w-1/2 max-md:w-2/3 max-sm:w-full max-xl:col-span-12">
            <div className="">
              <div className="h-9 w-full text-center bg-[#AAD3FF]">
                <p className="monumental tracking-[-2px] text-white font-bold text-base pt-2">
                  AHORRA HASTA UN{" "}
                  {
                    product.attributes.find((a) => a.attributeCode == "promo")
                      ?.optionText
                  }
                </p>
              </div>
              <div className="border border-[#AAD3FF] rounded-sm w-full">
                <div className="grid grid-cols-2">
                  <div className="md:pl-5 md:py-10 py-2 max-md:mx-auto monumental text-base font-bold max-lg:text-[1.3vw] max-md:text-base max-md:col-span-2">
                    DESDE ${product.price.regular.value.toLocaleString()}
                  </div>
                  <div className="max-md:mx-10 md:pr-5 md:pt-4 max-md:col-span-2">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setContactModal(true);
                      }}
                      className="h-11 w-full bg-[#0071EB] rounded-full text-center text-white monumental text-sm font-bold mt-2"
                    >
                      <a>CONSULTÁ</a>
                    </button>
                    <a
                      href={`https://wa.me/5492901619587?text=${encodeURIComponent(
                        `Hola! Me interesa consultar por la excursión ${product.name}`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-2 h-11 w-full bg-[#25D366] rounded-full text-white text-sm font-bold mt-2 hover:opacity-90 transition"
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
                      WHATSAPP
                    </a>
                    <ProductForm product={product} action={action} variant></ProductForm>
                  </div>
                </div>
                <div className="flex flex-row px-5 py-5">
                  <img
                    className="w-14 self-start mr-1"
                    src="/icons/Trekking/Reserva.svg"
                  ></img>
                  <p className="monumental text-xs font-bold text-[#AEB4B9]">
                    <span className="underline text-black">
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
        <div>
          <p className="monumental font-bold text-[#63687A]">
            <svg
              className="inline h-full mr-3 mb-1"
              width="16"
              height="16"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4.882 0.898L4.866 0.958C4.773 1.317 4.673 1.698 4.556 2.075C4.308 2.877 4.036 3.474 3.755 3.755C3.474 4.035 2.877 4.308 2.075 4.556C1.697 4.673 1.317 4.773 0.959 4.866L0.898 4.882C0.575 4.965 0.249 5.05 0 5.133V6.867C0.25 6.95 0.575 7.035 0.898 7.118L0.958 7.134C1.317 7.227 1.698 7.327 2.075 7.444C2.877 7.692 3.474 7.964 3.755 8.245C4.035 8.526 4.308 9.123 4.556 9.925C4.673 10.302 4.773 10.683 4.866 11.041L4.882 11.102C4.965 11.425 5.05 11.751 5.133 12H6.867C6.95 11.75 7.035 11.425 7.118 11.102L7.134 11.042C7.227 10.684 7.327 10.302 7.444 9.925C7.692 9.123 7.964 8.526 8.245 8.245C8.526 7.965 9.123 7.692 9.925 7.444C10.302 7.327 10.683 7.227 11.041 7.134L11.102 7.118C11.425 7.035 11.751 6.95 12 6.867V5.133C11.75 5.05 11.425 4.965 11.102 4.882L11.042 4.866C10.6673 4.77121 10.2949 4.66785 9.925 4.556C9.123 4.308 8.526 4.036 8.245 3.755C7.965 3.474 7.692 2.877 7.444 2.075C7.33217 1.70541 7.22881 1.33332 7.134 0.959L7.118 0.898C7.04359 0.596157 6.95988 0.296681 6.867 0L5.133 0C5.05 0.25 4.965 0.575 4.882 0.898ZM5.047 5.047C5.464 4.63 5.77 4.052 6 3.477C6.23 4.052 6.536 4.63 6.953 5.047C7.37 5.464 7.948 5.77 8.523 6C7.948 6.23 7.37 6.536 6.953 6.953C6.536 7.37 6.23 7.948 6 8.523C5.77 7.948 5.464 7.37 5.047 6.953C4.63 6.536 4.052 6.23 3.477 6C4.052 5.77 4.63 5.464 5.047 5.047Z"
                fill="#63687A"
              />
            </svg>
            Galería de Fotos y Videos
          </p>
        </div>
        <div className="grid gap-2 grid-cols-5 max-sm:grid-cols-1 max-lg:grid-cols-2 mb-5">
          <PhotoProvider>
            {product.gallery.map((img, index) => (
              <PhotoView key={`excursionImage${index}`} src={img?.origin}>
                <img
                  className="w-full aspect-square object-cover cursor-zoom-in"
                  src={img?.origin}
                  alt={img.alt}
                ></img>
              </PhotoView>
            ))}
          </PhotoProvider>
        </div>
        <div
          style={{
            display: contactModal ? "flex" : "none",
          }}
          className="fixed items-center top-0 bg-black w-full h-full left-0 bg-opacity-50 z-50 flex flex-row justify-center"
        >
          <div className="h-fit">
            <ConsultaExcursionForm
              closeModal={() => setContactModal(false)}
            ></ConsultaExcursionForm>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConsultaExcursionForm({ closeModal }) {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    tel: "",
    date: "",
    adults: 1,
    children: 0,
    babies: 0,
    message: "",
  });

  const [error, setError] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setError(false);
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      formData.nombre === "" ||
      formData.email === "" ||
      formData.tel === "" ||
      formData.date === "" ||
      formData.message === "" ||
      formData.adults === 0
    ) {
      setError(true);
      return;
    }

    const res = await fetch("/api/contact", {
      method: "POST",
      body: JSON.stringify({ ...formData, url: window.location.href }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.status == 200) {
      toast.info("Consulta enviada.");
    } else {
      toast.error("Error, intente denuevo más tarde.");
    }
    closeModal();
  };

  return (
    <div className="bg-white rounded-xl">
      <div className="w-full p-2 cursor-pointer" onClick={closeModal}>
        <img src="/icons/close.svg" alt="close" className="ml-auto" />
      </div>
      <div className="flex justify-center items-center">
        <form
          onSubmit={handleSubmit}
          className="p-6 w-full max-w-md [&_textarea]:border [&_select]:border [&_input]:border [&_textarea]:border-black [&_select]:border-black [&_input]:!border-black [&_select]:rounded-full [&_input]:!rounded-full "
        >
          <h2 className="text-center text-lg font-semibold mb-4">
            Consulta sobre esta excursión
          </h2>

          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="w-full mb-3 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <div className="flex gap-2 mb-3">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-1/2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              name="tel"
              placeholder="Teléfono"
              value={formData.tel}
              onChange={handleChange}
              className="w-1/2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full mb-3 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <div className="flex gap-2 mb-3">
            <p className="w-1/3 text-center">Mayores</p>
            <p className="w-1/3 text-center">Menores</p>
            <p className="w-1/3 text-center">Bebés</p>
          </div>

          <div className="flex gap-2 mb-3">
            <select
              name="adults"
              value={formData.adults}
              onChange={handleChange}
              className="w-1/3 px-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {[...Array(11).keys()].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>

            <select
              name="children"
              value={formData.children}
              onChange={handleChange}
              className="w-1/3 px-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {[...Array(11).keys()].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>

            <select
              name="babies"
              value={formData.babies}
              onChange={handleChange}
              className="w-1/3 px-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {[...Array(11).keys()].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>

          <textarea
            name="message"
            placeholder="Consulta"
            value={formData.message}
            onChange={handleChange}
            rows="4"
            className="w-full mb-3 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 rounded-full hover:bg-red-700 transition"
          >
            Enviar
          </button>
          {error && (
            <p className="text-center text-red-500">
              Complete todos los campos
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

function InfoIcon({ icon, text1, text2 }) {
  return (
    <div className="flex flex-row mt-2">
      <div className="border rounded-lg border-[#AEB4B9]">
        <img className="w-7 m-2" src={icon}></img>
      </div>
      <div className="px-2 w-4/5">
        <p className="monumental text-[0.675rem] font-bold text-nowrap overflow-ellipsis overflow-hidden">
          {text1.toUpperCase()}
        </p>
        <p className="monumental mt-1 text-[10px] text-[#63687A] text-nowrap overflow-ellipsis overflow-hidden">
          {text2}
        </p>
      </div>
    </div>
  );
}

function ListWithIcon({ ComponentType, color, text }) {
  return (
    <li className="flex">
      <span className="text-green-500"></span>
      <div className="w-fit">
        <ComponentType className={"h-8 mr-2 text-" + color + "-500"} />
      </div>
      <p className="break-all">{text}</p>
    </li>
  );
}

export const layout = {
  areaId: "excursionView",
  sortOrder: 1,
};

export const query = `
  query Query {
    product (id: getContextValue('productId')) {
      description
      sku
      name
      inventory {
        isInStock
      }
      category {
        path {
          name
        }
      }
      attributes: attributeIndex {
        attributeName
        attributeCode
        optionText
      }
      image {
        alt
        thumb
        single
        origin
      }
      gallery {
        alt
        thumb
        single
        origin
      }
      price {
        regular {
          value
          text
        }
        special {
          value
          text
        }
      }
    }
    action:url (routeId: "addMineCartItem")
  }`;

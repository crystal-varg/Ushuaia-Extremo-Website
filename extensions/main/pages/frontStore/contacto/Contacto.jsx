import React, { useState } from "react";
import "./contacto.css";

export default function Contacto() {
  const [nombre, setNombre] = useState("");
  const [tel, setTel] = useState("");
  const [asunto, setAsunto] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [feedback, setFeedback] = useState({ type: "", text: "" }); // 👈 nuevo estado

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombre || !tel || !message) {
      setFeedback({ type: "error", text: "Faltan completar datos" });
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        body: JSON.stringify({ nombre, tel, email, message }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (res.ok) {
        setFeedback({
          type: "success",
          text: "Formulario enviado correctamente ✅",
        });
        setNombre("");
        setTel("");
        setAsunto("");
        setMessage("");
      } else {
        throw new Error(data?.error || "Error al enviar el formulario");
      }
    } catch (error) {
      setFeedback({
        type: "error",
        text: "Hubo un problema al enviar el formulario ❌",
      });
      console.error(error);
    }
  };

  return (
    <div className="container-fluid contact ">
      <div className="bg-[#EEF7FF] p-2 rounded-lg shadow-2xl text-center">
        <h1 className="flex flex-col font-black">
          <span className="zuume text-4xl text-center leading-[.8]">
            CONTÁCTATE CON
          </span>
          <span className="zuume text-5xl">USHUAIA EXTREMO</span>
        </h1>
        <p className="text font-bold">
          Envía tu consulta y nosotros responderemos
        </p>
        <form
          onSubmit={handleSubmit}
          className="w-full form-flex monumental text-base"
        >
          <div className="container [&_input]:!bg-white [&_textarea]:!bg-white [&_input]:!border-2 [&_textarea]:!border-2 !shadow-none">
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Nombre"
              className="form-color left-top"
            />
            <input
              type="text"
              value={tel}
              onChange={(e) => setTel(e.target.value)}
              placeholder="Telefono"
              className="form-color right-top"
            />
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="form-color left-bottom input col-span-2"
            />
            <textarea
              placeholder="Mensaje"
              className="form-color text-area input"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
          </div>
          <button
            type="submit"
            className="button ml-auto zuume text-3xl font-black !rounded-lg font-bold"
          >
            <p className="mx-10">ENVIAR</p>
          </button>
        </form>

        {/* Mensaje de feedback */}
        {feedback.text && (
          <p
            className={`mt-4 text-center ${
              feedback.type === "success" ? "text-green-600" : "text-red-600"
            }`}
          >
            {feedback.text}
          </p>
        )}
      </div>
    </div>
  );
}

export const layout = {
  areaId: "content",
  sortOrder: 2,
};

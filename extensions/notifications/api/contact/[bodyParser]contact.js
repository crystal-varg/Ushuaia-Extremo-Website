const { sendEmail } = require("../../helpers/emailSender");
const {
  getSetting,
} = require("@evershop/evershop/src/modules/setting/services/setting");

module.exports = async function (request, response) {
  let { asunto } = request.body;
  const { nombre, tel, email, message, date, adults, children, babies, url } =
    request.body;

  if (!nombre || !tel || !message) {
    return response.status(400).json({ error: "Faltan datos necesarios" });
  }

  let template = "";

  if (url) {
    template = `
    <div style="font-family: Arial, sans-serif; padding: 16px; background-color: #f9f9f9; color: #333;">
      <h2 style="color: #d32f2f; margin-bottom: 12px;">Nueva consulta desde tu E-commerce</h2>
      
      <p><strong>Nombre:</strong> ${nombre}</p>
      <p><strong>Telefono:</strong> ${tel}</p>
      <p><strong>Email:</strong> ${email}</p>

      <p><strong>Asunto:</strong> Consulta desde ${url}</p>
      <p><strong>Fecha de Reserva:</strong> ${date}</p>
      <p><strong>Adultos:</strong> ${adults}</p>
      <p><strong>Niños:</strong> ${children}</p>
      <p><strong>Bebés:</strong> ${babies}</p>
      
      <p><strong>Mensaje:</strong></p>
      <div style="border-left: 4px solid #d32f2f; padding: 8px 12px; background: #fff; margin-top: 8px;">
        ${message}
      </div>
      
      <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;" />
      <p style="font-size: 12px; color: #777;">
        Este correo fue generado automáticamente desde tu formulario web.
      </p>
    </div>
  `;
  } else {
    asunto = "Consulta desde formulario de contacto";
    template = `
    <div style="font-family: Arial, sans-serif; padding: 16px; background-color: #f9f9f9; color: #333;">
      <h2 style="color: #d32f2f; margin-bottom: 12px;">Nueva consulta desde tu E-commerce</h2>
      
      <p><strong>Nombre:</strong> ${nombre}</p>
      <p><strong>Telefono:</strong> ${tel}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Asunto:</strong> ${asunto}</p>
      
      <p><strong>Mensaje:</strong></p>
      <div style="border-left: 4px solid #d32f2f; padding: 8px 12px; background: #fff; margin-top: 8px;">
        ${message}
      </div>
      
      <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;" />
      <p style="font-size: 12px; color: #777;">
        Este correo fue generado automáticamente desde tu formulario web.
      </p>
    </div>
  `;
  }

  const res = await sendEmail({
    to: await getSetting("storeEmail", "info@ushuaiaextremotravels.com"),
    subject: `Nueva consulta: ${asunto}`,
    html: template,
    email,
  });

  return response.json({
    message: "Correo de consulta enviado correctamente",
  });
};

const { sendEmail } = require("../../helpers/emailSender");

module.exports = async function (request, response) {
  const { email, order } = request.body;

  if (!email || !order) {
    // Respondé y cortá aquí si faltan datos
    return response.status(400).json({ error: "Faltan datos necesarios" });
  }

  await sendEmail({
    to: email,
    subject: "¡Gracias por tu compra!",
    html: `<p>Hola ${order.shippingAddress.firstName},</p>
           <p>Tu pedido <strong>#${order.number}</strong> ha sido recibido correctamente.</p>
           <p>¡Gracias por confiar en nosotros!</p>`,
  });

  return response.json({ message: "Correo de renta enviado correctamente" });
};

const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const CLIENT_ID =
  "511843159724-gd7b9ejhshe52e3jk5rdj5tfsb0qbq8b.apps.googleusercontent.com";
const CLIENT_SECRET = "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";

const USER_EMAIL = "info@ushuaiaextremotravels.com";

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET);

let refresh_token =
  "1//0hURwTJP1g3mnCgYIARAAGBESNwF-L9IriX4CcemzeYPMCRgzvvAYYo5xtvIYPTi-ZUKT4zfXEuIb6bYwpDZCu6O4fbBee4-YMxs";

oAuth2Client.setCredentials({
  refresh_token: refresh_token,
});

const sendEmail = async ({ to, subject, html, email }) => {
  let accessToken = await oAuth2Client.getAccessToken();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: USER_EMAIL,
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      refreshToken: refresh_token,
      accessToken: accessToken.token,
    },
  });

  const mailOptions = {
    from: USER_EMAIL,
    to,
    subject,
    html,
    replyTo: email,
  };

  try {
    const res = await transporter.sendMail(mailOptions);
    console.log(`Email enviado a ${to}`);
    return res;
  } catch (error) {
    console.error("Error al enviar el correo:", error);
  }
};

module.exports = { sendEmail };

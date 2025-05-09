import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASS,
    }
  });

export const getMailConfig = (user) => ({
  from: `"Nicki Store" <${process.env.NODEMAILER_USER}>`,
  to: user.email,
  subject: '🎉 ¡Bienvenido/a a nuestra tienda!',
  html: `
    <h1>Hola ${user.first_name}!</h1>
    <p>Gracias por registrarte. Estamos felices de tenerte en la comunidad 🛒.</p>
    <p>¡Explorá nuestros productos y empezá a comprar!</p>
  `,
});

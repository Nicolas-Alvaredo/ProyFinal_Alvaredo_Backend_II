export const getResetEmailConfig = (user, token) => ({
    from: `"Nicki Store" <${process.env.NODEMAILER_USER}>`,
    to: user.email,
    subject: '🔐 Recuperación de contraseña',
    html: `
      <h2>Hola ${user.first_name}!</h2>
      <p>Este es tu token para restablecer tu contraseña (válido por 1 hora):</p>
      <pre style="background-color:#eee;padding:10px;">${token}</pre>
      <p>Usalo con este endpoint:</p>
      <code>PUT /api/sessions/reset-password</code>
      <p>Con este header:</p>
      <pre>Authorization: Bearer ${token}</pre>
      <p>Y este body en JSON:</p>
      <pre>{ "newPassword": "tu-nueva-clave" }</pre>
    `
  });
  
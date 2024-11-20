import { db } from "../../../db";
import nodemailer from 'nodemailer';

// Función para eliminar usuarios no verificados después de 1 minuto
export const deleteUnverifiedUsers = async () => {
  const expirationTime = new Date(Date.now() - 10 * 60 * 1000); 
  try {
      await db.fit_usuario.deleteMany({
          where: {
              estado_verificacion: 0,
              F_REGISTRO: {
                  lt: expirationTime,
              },
          },
      });
      console.log("Usuarios no verificados eliminados correctamente");
  } catch (error) {
      console.error("Error al eliminar usuarios no verificados:", error);
  }
};

//GENERACION DE CODIGO
export function generateVerificationCode(): string {
    const length = 6;
    const characters = '0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
}

//ENVIAR CODIGO
export async function sendVerificationEmail(email: string, code: string, nombre: string, tipo: string):Promise<void> {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: "fitlunchlunnch@gmail.com",
          pass: "yrax gane aare xdmj",
        },
    });
    
    let subject = 'Código de verificación - FITLUNCH';
    let htmlContent = `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <h2 style="color: #4CAF50;">Hola, ${nombre}!</h2>
        <p>Gracias por registrarte en FitLunch. Tu código de verificación es:</p>
        <div style="font-size: 24px; color: #4CAF50; font-weight: bold; margin: 20px 0;">
          ${code}
        </div>
        <p>Por favor, usa este código para completar tu registro.</p>
        <p>¡Gracias por elegir FitLunch!</p>
      </div>
    `;

    if (tipo === 'recuperacion') {
      subject = 'Recuperación de contraseña - FITLUNCH';
      htmlContent = `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
          <h2 style="color: #4CAF50;">Hola, ${nombre}!</h2>
          <p>Recibimos una solicitud para restablecer tu contraseña de FitLunch. Tu código de verificación es:</p>
          <div style="font-size: 24px; color: #4CAF50; font-weight: bold; margin: 20px 0;">
            ${code}
          </div>
          <p>Utiliza este código para restablecer tu contraseña. Si no solicitaste este cambio, ignora este mensaje.</p>
          <p>¡Gracias por confiar en FitLunch!</p>
        </div>
      `;
    }

    await transporter.sendMail({
      from: 'fitlunchlunnch@gmail.com',
      to: email,
      subject: subject,
      text: `Hola ${nombre}!`,
      html: htmlContent,
    });
}
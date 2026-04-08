import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { nombre, correo, mensaje } = req.body;

  if (!nombre || !correo || !mensaje) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }

  const fecha = new Date().toLocaleString('es-MX', {
    timeZone: 'America/Tijuana',
    dateStyle: 'long',
    timeStyle: 'short',
  });

  try {
    await resend.emails.send({
      from: 'leads@impulsoemprendedor.com.mx',
      to: 'info@impulsoemprendedor.com.mx',
      subject: `Nuevo lead — ${nombre}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#f9f9f9;border-radius:8px;">
          <div style="background:#F9452E;padding:20px 32px;border-radius:6px 6px 0 0;">
            <h1 style="color:#fff;margin:0;font-size:20px;">Nuevo lead desde el sitio web</h1>
          </div>
          <div style="background:#fff;padding:32px;border-radius:0 0 6px 6px;border:1px solid #e5e5e5;border-top:none;">
            <table style="width:100%;border-collapse:collapse;">
              <tr>
                <td style="padding:12px 0;border-bottom:1px solid #f0f0f0;color:#666;font-size:13px;width:120px;">Nombre</td>
                <td style="padding:12px 0;border-bottom:1px solid #f0f0f0;font-weight:600;color:#313036;">${nombre}</td>
              </tr>
              <tr>
                <td style="padding:12px 0;border-bottom:1px solid #f0f0f0;color:#666;font-size:13px;">Correo</td>
                <td style="padding:12px 0;border-bottom:1px solid #f0f0f0;"><a href="mailto:${correo}" style="color:#F9452E;">${correo}</a></td>
              </tr>
              <tr>
                <td style="padding:12px 0;border-bottom:1px solid #f0f0f0;color:#666;font-size:13px;">Fecha</td>
                <td style="padding:12px 0;border-bottom:1px solid #f0f0f0;color:#313036;">${fecha}</td>
              </tr>
              <tr>
                <td style="padding:16px 0;color:#666;font-size:13px;vertical-align:top;">Mensaje</td>
                <td style="padding:16px 0;color:#313036;line-height:1.6;">${mensaje.replace(/\n/g, '<br>')}</td>
              </tr>
            </table>
            <div style="margin-top:24px;">
              <a href="mailto:${correo}" style="background:#F9452E;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600;font-size:14px;">Responder a ${nombre} →</a>
            </div>
          </div>
          <p style="color:#aaa;font-size:12px;text-align:center;margin-top:16px;">Impulso Emprendedor by Integro · impulsoemprendedor.com.mx</p>
        </div>
      `,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Resend error:', error);
    return res.status(500).json({ error: 'Error al enviar el mensaje' });
  }
}

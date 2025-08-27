'use server'

import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendVerificationResetPassword(
  email: string,
  name: string,
  token: string
) {
  // Define url de verificação
  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}&email=${email}`

  const { data, error } = await resend.emails.send({
    from: `Ondagest PMS <${process.env.RESEND_FROM}>`,
    to: email,
    subject: 'Recuperação de senha',
    html: `
      <!DOCTYPE html>
      <html>
        <body style="margin:0; padding:0; background-color:#f6f6f6; font-family: Arial, sans-serif; color:#333;">
          <!-- Container -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f6f6f6; padding:20px 0;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff; border-radius:6px; overflow:hidden; border: 1px solid #a7a7a7;">
                  
                  <!-- Header -->
                  <tr>
                    <td style="background-color:#085a9e; padding:20px;">
                      <table cellpadding="0" cellspacing="0" border="0" align="left">
                        <tr>
                          <td style="padding-right:10px;">
                            <img src="https://pzjkycvjhxnybnbyvjjm.supabase.co/storage/v1/object/public/public-media/logos/4b693698-8a79-4aa9-9614-a238927a6980.png" alt="Ondagest" style="height:40px; display:block;" />
                          </td>
                          <td style="font-size:20px; font-weight:bold; color:#ffffff;">
                            Ondagest PMS
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Body -->
                  <tr>
                    <td style="padding:30px;">
                      <p style="font-size:16px;">Olá <b>${name}</b>,</p>
                      <p style="font-size:16px; line-height:24px;">
                        Recebemos uma solicitação para redefinir a sua senha no Ondagest PMS. Clique no botão abaixo para criar uma nova senha:
                      </p>

                      <!-- Botão -->
                      <p style="text-align:center; margin:30px 0;">
                        <a href="${verifyUrl}" style="background-color:#085a9e; color:#ffffff; padding:12px 24px; text-decoration:none; font-weight:bold; border-radius:4px; display:inline-block;">
                          Redefinir senha
                        </a>
                      </p>

                      <p style="font-size:14px; color:#666;">
                        O link expira em 1 hora.
                        Se você não solicitou a alteração, ignore este e-mail. Caso o botão acima não funcione, copie e cole o link abaixo no navegador:
                      </p>

                      <p style="font-size:12px; word-break:break-all; color:#085a9e;">
                        <a href="${verifyUrl}" style="color:#085a9e;">${verifyUrl}</a>
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>

    `,
  })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, error: null }
}

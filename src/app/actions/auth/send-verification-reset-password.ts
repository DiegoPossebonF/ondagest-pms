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
      <p>Olá ${name},</p>
      <p>Você solicitou redefinição de senha. Clique no link abaixo para redefinir sua senha:</p>
      <p><a href="${verifyUrl}">${verifyUrl}</a></p>
    `,
  })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, error: null }
}

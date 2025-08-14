'use server'

import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendVerificationEmail(
  email: string,
  name: string,
  token: string
) {
  // 3. Enviar e-mail de confirmação
  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}&email=${email}`

  const { data, error } = await resend.emails.send({
    from: 'Ondagest PMS <onboarding@resend.dev>',
    to: email,
    subject: 'Confirme seu e-mail',
    html: `
      <p>Olá ${name},</p>
      <p>Obrigado por se registrar! Clique no link abaixo para confirmar seu e-mail:</p>
      <p><a href="${verifyUrl}">${verifyUrl}</a></p>
    `,
  })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, error: null }
}

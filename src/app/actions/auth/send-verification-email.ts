'use server'

import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendVerificationEmail(
  email: string,
  name: string,
  token: string
) {
  // 3. Enviar e-mail de confirmação
  const confirmationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`

  const { data, error } = await resend.emails.send({
    from: 'Ondagest PMS <onboarding@resend.dev>',
    to: email,
    subject: 'Confirme seu e-mail',
    html: `
      <p>Olá ${name},</p>
      <p>Obrigado por se registrar! Clique no link abaixo para confirmar seu e-mail:</p>
      <p><a href="${confirmationUrl}">${confirmationUrl}</a></p>
    `,
  })

  console.log('data email', data)

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, error: null }
}

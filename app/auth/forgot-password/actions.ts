'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { Resend } from 'resend'
import { render } from '@react-email/render'
import { PasswordResetEmail } from '@/components/templates/password-reset-email'

// Resposta sempre uniforme para evitar user enumeration — não revelamos
// se o email existe ou não. Mensagem genérica em todos os caminhos.
const GENERIC_RESPONSE = {
  ok: true,
  message: 'Se este email pertencer a uma conta de administrador, vais receber instruções de recuperação em breve.',
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function pedirRecuperacaoPassword(
  formData: FormData,
): Promise<{ ok: boolean; message: string; error?: string }> {
  const email = (formData.get('email') as string || '').trim().toLowerCase()

  if (!email || !EMAIL_RE.test(email)) {
    return { ok: false, message: '', error: 'Email inválido.' }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  try {
    const admin = createAdminClient()

    // generateLink type=recovery falha silenciosamente se o email não existir.
    // Não revelamos isso ao cliente.
    const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({
      type: 'recovery',
      email,
      options: { redirectTo: `${siteUrl}/auth/set-password` },
    })

    // Se houve erro (email não existe) → resposta genérica, sem revelar.
    if (linkError || !linkData?.properties?.action_link) {
      return GENERIC_RESPONSE
    }

    const resetUrl = linkData.properties.action_link

    if (!process.env.RESEND_API_KEY) {
      // Configuração em falta — log mas devolve genérica.
      console.error('[forgot-password] RESEND_API_KEY não configurada.')
      return GENERIC_RESPONSE
    }

    const resend = new Resend(process.env.RESEND_API_KEY)
    const html = await render(PasswordResetEmail({ resetUrl }))

    const { error: sendError } = await resend.emails.send({
      from: 'Infante Boxing Club <noreply@associacaoinfante.pt>',
      to: email,
      subject: 'Recuperar password — Infante Boxing Club',
      html,
    })

    if (sendError) {
      console.error('[forgot-password] erro Resend:', sendError.message)
      // Devolve genérica mesmo assim — não expõe falha de envio ao utilizador.
      return GENERIC_RESPONSE
    }

    return GENERIC_RESPONSE
  } catch (err) {
    console.error('[forgot-password] erro inesperado:', err)
    return GENERIC_RESPONSE
  }
}

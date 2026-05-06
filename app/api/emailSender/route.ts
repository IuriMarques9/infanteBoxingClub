import { Resend } from 'resend';
import { render } from '@react-email/render';
import { EmailTemplate } from "../../../components/templates/email-template";


const resend = new Resend(process.env.RESEND_API_KEY!);

const SUBJECT_LABELS: Record<string, string> = {
  aula_gratis: '1ª aula grátis',
  produto: 'Loja / produto',
  evento: 'Evento',
  geral: 'Geral',
}

export async function POST( data: Request) {

    const { name, email, message, subject } = await data.json();
    const subjectLabel = SUBJECT_LABELS[subject] ?? SUBJECT_LABELS.geral;

    try {
        const emailHtml = await render(EmailTemplate({ name, email, message }));

        const { data, error } = await resend.emails.send({
            from: 'Website Form <onboarding@resend.dev>',
            to: 'associacao.infante@gmail.com',
            subject: `[${subjectLabel}] Contacto via website`,
            html: emailHtml,
        });


        if (error) {
            return Response.json({ error }, { status: 400 });
        }


        return Response.json(data);
    } catch (error) {
        return Response.json({ error }, { status: 500 });
    }
}

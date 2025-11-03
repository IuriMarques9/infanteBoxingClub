import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';
import { google } from 'googleapis';

const CLIENT_ID = process.env.GMAIL_CLIENT_ID;
const CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET;
const REDIRECT_URI = process.env.GMAIL_REDIRECT_URI;
const REFRESH_TOKEN = process.env.GMAIL_REFRESH_TOKEN;
const GMAIL_USER = process.env.GMAIL_USER;

// Verifica se as variáveis essenciais estão definidas
if (!CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URI || !REFRESH_TOKEN || !GMAIL_USER) {
    console.error("Variáveis de ambiente do Gmail não estão definidas corretamente.");
    // Num cenário real, podes querer que a aplicação falhe ao iniciar se estas
    // não estiverem definidas, mas para uma API route, logar é crucial.
}

const OAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
OAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

export async function POST( req: Request) {
    
    try {
        const body = await req.json();
        const { name, email, message } = body;

        if (!name || !email || !message) {
            return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
          }

        // Obter o Access Token (que expira) usando o Refresh Token (que é de longa duração)
        const accessTokenResponse = await OAuth2Client.getAccessToken();
        const accessToken = accessTokenResponse.token;

        if (!accessToken) {
            return NextResponse.json({ success: false, error: "Failed to get access token" }, { status: 500 });
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: GMAIL_USER,
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken,
            },
        });
    
        // Defina os corpo do email
        const mailOptions = {
            from: `${name} <${GMAIL_USER}>`, // O nome do utilizador, mas o email DA TUA CONTA
            to: GMAIL_USER, // Envia para ti mesmo
            replyTo: email, // O email do utilizador para onde vais responder
            subject: `Nova Mensagem do Formulário de Contato do Website`,
            html: `
                <p><strong>Nome:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Mensagem:</strong> ${message}</p>
            `,
        };

        // Envie o email
        const result = await transporter.sendMail(mailOptions);

        return NextResponse.json({ success: true, result }, { status: 200 });
    } catch (error) {
        // Evita expor detalhes do erro ao cliente
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ success: false, error: `Failed to send email: ${errorMessage}` }, { status: 500 });
    }
}

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
                <!DOCTYPE html>
                <html lang="pt">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Nova Mensagem de Contato</title>
                    <style>
                        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
                        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
                        img { -ms-interpolation-mode: bicubic; }
                        
                        .main-container {
                            max-width: 600px;
                            margin: 0 auto;
                            border-collapse: collapse;
                            font-family: Arial, sans-serif;
                        }

                        .header-cell {
                            background-color: #007bff; /* Azul primário */
                            color: #ffffff;
                            padding: 20px 30px;
                            font-size: 24px;
                            font-weight: bold;
                            text-align: center;
                        }

                        .content-cell {
                            padding: 30px;
                            background-color: #ffffff;
                            font-size: 16px;
                            line-height: 1.6;
                            color: #333333;
                        }

                        .data-label {
                            font-weight: bold;
                            color: #555555;
                            display: inline-block;
                            width: 80px; /* Alinhamento visual */
                            vertical-align: top;
                        }
                        
                        .data-value {
                            font-weight: normal;
                            color: #111111;
                        }
                        
                        .message-box {
                            margin-top: 20px;
                            border-left: 3px solid #007bff;
                            padding: 10px 15px;
                            background-color: #f8f9fa;
                        }

                        .footer-cell {
                            padding: 20px 30px;
                            background-color: #f1f1f1;
                            text-align: center;
                            font-size: 12px;
                            color: #777777;
                        }

                        @media screen and (max-width: 520px) {
                            .header-cell { font-size: 20px; }
                            .content-cell { padding: 20px; }
                        }
                    </style>
                </head>
                <body style="margin: 0; padding: 0; background-color: #f4f4f4;">
                    <center>
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" class="main-container">
                            <tr>
                                <td align="center" class="header-cell">
                                    🔔 Nova Mensagem de Contato
                                </td>
                            </tr>

                            <tr>
                                <td align="left" class="content-cell">
                                    <p style="margin-top: 0;">Recebeste uma nova submissão do formulário de contacto do website da Associação Infante:</p>

                                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                        <tr>
                                            <td style="padding-bottom: 15px;">
                                                <span class="data-label">Nome do utilizador:</span> 
                                                <span class="data-value">${name}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="padding-bottom: 15px;">
                                                <span class="data-label">Email do utilizador:</span> 
                                                <span class="data-value"><a href="mailto:${email}" style="color:#007bff; text-decoration: none;">${email}</a></span>
                                            </td>
                                        </tr>
                                    </table>

                                    <p style="font-weight: bold; margin-bottom: 10px; margin-top: 25px;">Mensagem:</p>

                                    <div class="message-box">
                                        <p style="margin: 0;">
                                        ${message.replace(/\n/g, '<br>')}
                                        </p>
                                    </div>

                                    <p style="margin-top: 30px; font-style: italic; color: #777777;">
                                        Podes responder a esta mensagem diretamente clicando em "Responder".
                                    </p>
                                </td>
                            </tr>
                            
                            <tr>
                                <td class="footer-cell">
                                    Este é um email de notificação automática do teu website.
                                </td>
                            </tr>
                        </table>
                    </center>
                </body>
                </html>
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

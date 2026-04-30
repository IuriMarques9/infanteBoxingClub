import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface Props {
  resetUrl: string;
}

export const PasswordResetEmail = ({ resetUrl }: Props) => (
  <Html>
    <Head />
    <Preview>Recuperar password do Infante Boxing Club</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Heading style={h1}>INFANTE BOXING CLUB</Heading>
          <Text style={subtitle}>Recuperação de Password</Text>
        </Section>

        <Section style={content}>
          <Heading style={h2}>Olá!</Heading>
          <Text style={paragraph}>
            Recebemos um pedido para recuperar a password da tua conta de
            administrador do <strong style={highlight}>Infante Boxing Club</strong>.
          </Text>
          <Text style={paragraph}>
            Para definir uma nova password, clica no botão abaixo:
          </Text>

          <Section style={buttonContainer}>
            <Button href={resetUrl} style={button}>
              Definir Nova Password
            </Button>
          </Section>

          <Text style={smallText}>
            Se o botão não funcionar, copia e cola este link no teu navegador:
          </Text>
          <Link href={resetUrl} style={fallbackLink}>
            {resetUrl}
          </Link>

          <Text style={warning}>
            Este link expira em 1 hora por segurança.
          </Text>
        </Section>

        <Hr style={hr} />

        <Section style={footer}>
          <Text style={footerText}>
            Se não pediste esta recuperação, podes ignorar este email — a tua
            password atual continua válida.
          </Text>
          <Text style={footerBrand}>
            © {new Date().getFullYear()} Infante Boxing Club
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default PasswordResetEmail;

// ─── Estilos (alinhados com o invite email) ────────────────────

const main: React.CSSProperties = {
  backgroundColor: "#0A0A0A",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, sans-serif',
  margin: 0,
  padding: 0,
};

const container: React.CSSProperties = {
  maxWidth: "600px",
  margin: "0 auto",
  padding: "40px 20px",
};

const header: React.CSSProperties = {
  textAlign: "center",
  paddingBottom: "32px",
  borderBottom: "1px solid rgba(232, 181, 91, 0.2)",
};

const h1: React.CSSProperties = {
  color: "#E8B55B",
  fontSize: "24px",
  fontWeight: 800,
  letterSpacing: "0.15em",
  margin: 0,
  textTransform: "uppercase",
};

const subtitle: React.CSSProperties = {
  color: "rgba(255,255,255,0.5)",
  fontSize: "11px",
  fontWeight: 700,
  letterSpacing: "0.25em",
  textTransform: "uppercase",
  margin: "8px 0 0 0",
};

const content: React.CSSProperties = {
  padding: "32px 0",
};

const h2: React.CSSProperties = {
  color: "#E8B55B",
  fontSize: "20px",
  fontWeight: 700,
  margin: "0 0 16px 0",
};

const paragraph: React.CSSProperties = {
  color: "rgba(255,255,255,0.85)",
  fontSize: "15px",
  lineHeight: "1.6",
  margin: "0 0 16px 0",
};

const highlight: React.CSSProperties = {
  color: "#E8B55B",
};

const buttonContainer: React.CSSProperties = {
  textAlign: "center",
  padding: "24px 0",
};

const button: React.CSSProperties = {
  backgroundColor: "#E8B55B",
  color: "#0A0A0A",
  fontSize: "13px",
  fontWeight: 800,
  letterSpacing: "0.15em",
  textTransform: "uppercase",
  padding: "14px 32px",
  borderRadius: "12px",
  textDecoration: "none",
  display: "inline-block",
};

const smallText: React.CSSProperties = {
  color: "rgba(255,255,255,0.4)",
  fontSize: "12px",
  margin: "24px 0 8px 0",
};

const fallbackLink: React.CSSProperties = {
  color: "#E8B55B",
  fontSize: "11px",
  wordBreak: "break-all",
  textDecoration: "underline",
};

const warning: React.CSSProperties = {
  color: "rgba(255,200,100,0.7)",
  fontSize: "12px",
  marginTop: "20px",
  fontStyle: "italic",
};

const hr: React.CSSProperties = {
  borderColor: "rgba(255,255,255,0.05)",
  margin: "32px 0",
};

const footer: React.CSSProperties = {
  textAlign: "center",
};

const footerText: React.CSSProperties = {
  color: "rgba(255,255,255,0.3)",
  fontSize: "11px",
  margin: "0 0 8px 0",
};

const footerBrand: React.CSSProperties = {
  color: "rgba(232,181,91,0.5)",
  fontSize: "10px",
  fontWeight: 700,
  letterSpacing: "0.2em",
  textTransform: "uppercase",
  margin: 0,
};

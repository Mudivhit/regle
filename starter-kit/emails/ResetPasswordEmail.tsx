import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
  Button,
  Section,
  Hr,
} from '@react-email/components';
import * as React from 'react';

interface ResetPasswordEmailProps {
  resetLink?: string;
  userEmail?: string;
}

export const ResetPasswordEmail = ({ 
  resetLink = 'https://regle.example.com/reset-password',
  userEmail = 'user@example.com' 
}: ResetPasswordEmailProps) => (
  <Html>
    <Head />
    <Preview>Reset your Regle password</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Reset Password</Heading>
        <Text style={text}>
          We received a request to reset the password for your Regle account associated with <strong>{userEmail}</strong>.
        </Text>
        <Text style={text}>
          Click the button below to set up a new password. If you didn't request this, you can safely ignore this email.
        </Text>
        <Section style={btnContainer}>
          <Button style={button} href={resetLink}>
            Reset Password
          </Button>
        </Section>
        <Text style={text}>
          Or copy and paste this URL into your browser:
          <br />
          <Link href={resetLink} style={link}>
            {resetLink}
          </Link>
        </Text>
        <Hr style={hr} />
        <Text style={footer}>
          This link will expire in 24 hours.
        </Text>
      </Container>
    </Body>
  </Html>
);

export default ResetPasswordEmail;

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '40px 20px',
  maxWidth: '560px',
};

const h1 = {
  color: '#16181d',
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '40px',
  margin: '0 0 20px',
};

const text = {
  color: '#444444',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '0 0 20px',
};

const link = {
  color: '#0066cc',
  textDecoration: 'none',
};

const btnContainer = {
  margin: '32px 0',
};

const button = {
  backgroundColor: '#16181d',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '15px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
  fontWeight: '500',
};

const hr = {
  borderColor: '#eaeaea',
  margin: '32px 0 24px',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
};

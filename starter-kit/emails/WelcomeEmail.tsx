import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Button,
  Section,
  Hr,
} from '@react-email/components';
import * as React from 'react';

interface WelcomeEmailProps {
  name?: string;
}

export const WelcomeEmail = ({ name = 'there' }: WelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>Welcome to Regle - Let's get started</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Welcome to Regle</Heading>
        <Text style={text}>Hi {name},</Text>
        <Text style={text}>
          We're thrilled to have you on board. Regle is designed to help you build and scale your projects with speed and elegance.
        </Text>
        <Section style={btnContainer}>
          <Button style={button} href="https://regle.example.com/dashboard">
            Get Started
          </Button>
        </Section>
        <Text style={text}>
          If you have any questions or need assistance, feel free to reply to this email. We're here to help!
        </Text>
        <Hr style={hr} />
        <Text style={footer}>
          Regle, Inc. · 123 Builder Street, Tech City, TC 10000
        </Text>
      </Container>
    </Body>
  </Html>
);

export default WelcomeEmail;

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

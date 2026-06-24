import * as React from 'react';
import { Html, Head, Preview, Body, Container, Section, Text, Heading, Button } from '@react-email/components';

interface WelcomeEmailProps {
  firstName: string;
}

export default function WelcomeEmail({ firstName = "there" }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to MailingPerson!</Preview>
      <Body style={{ backgroundColor: '#ffffff', fontFamily: 'sans-serif' }}>
        <Container style={{ margin: '0 auto', padding: '20px', maxWidth: '600px' }}>
          <Section>
            <Heading style={{ fontSize: '24px', fontWeight: 'bold' }}>Welcome to MailingPerson</Heading>
            <Text>Hi {firstName},</Text>
            <Text>We're excited to have you on board. You can now send beautiful bulk campaigns easily and quickly.</Text>
            <Button href="https://mailingperson.com/dashboard" style={{ backgroundColor: '#2563eb', color: '#fff', padding: '12px 20px', borderRadius: '5px' }}>
              Go to Dashboard
            </Button>
            <Text>Thanks,<br/>The MailingPerson Team</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

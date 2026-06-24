import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
  Tailwind,
  Hr,
  Link,
  Heading,
} from "@react-email/components";
import * as React from "react";

interface BaseEmailProps {
  content: string;
  previewText?: string;
  senderName?: string;
}

export const BaseEmail = ({
  content,
  previewText = "You've received a new email",
  senderName = "SaaS Mailer",
}: BaseEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-zinc-50 my-auto mx-auto font-sans">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px] bg-white shadow-sm">
            <Section className="mt-[32px]">
              <Heading className="text-zinc-900 text-[24px] font-normal text-center p-0 my-[30px] mx-0">
                <strong>{senderName}</strong>
              </Heading>
            </Section>
            
            <Section>
              {/* User content is injected here */}
              <div 
                className="text-zinc-700 text-[14px] leading-[24px]"
                dangerouslySetInnerHTML={{ __html: content }} 
              />
            </Section>

            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
            
            <Section className="text-center">
              <Text className="text-[#666666] text-[12px] leading-[24px]">
                This email was sent by <strong>{senderName}</strong>. 
                If you have any questions, please reply to this email.
              </Text>
              <Text className="text-[#999999] text-[10px] mt-2">
                © 2026 {senderName}. All rights reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default BaseEmail;

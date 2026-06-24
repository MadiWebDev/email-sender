import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import { BaseEmail } from "./templates/BaseEmail";
import React from "react";

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  fromName?: string;
  fromEmail?: string;
  gmailEmail: string;
  gmailAppPassword: string;
  recipientData?: Record<string, any>[]; // Data for variable replacement
}

export const sendEmail = async (options: SendEmailOptions) => {
  const { to, subject, html, fromName, fromEmail, gmailEmail, gmailAppPassword, recipientData } = options;

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: gmailEmail,
      pass: gmailAppPassword,
    },
  });

  const senderDisplayName = fromName || gmailEmail;
  const from = `"${senderDisplayName}" <${gmailEmail}>`;
  const recipients = Array.isArray(to) ? to : [to];
  
  const results = {
    success: true,
    sentCount: 0,
    failedCount: 0,
    errors: [] as { email: string; error: any }[],
    messageIds: [] as string[]
  };

  // Helper to replace variables in a string
  const replaceVariables = (text: string, data: Record<string, any>) => {
    return text.replace(/\{\{(.*?)\}\}/g, (match, key) => {
      const value = data[key.trim()];
      return value !== undefined ? value : match;
    });
  };

  for (let i = 0; i < recipients.length; i++) {
    const recipient = recipients[i];
    const data = recipientData?.[i] || { email: recipient };
    
    // Personalize content
    const personalizedHtmlRaw = replaceVariables(html, data);
    const personalizedSubject = replaceVariables(subject, data);

    // Wrap in professional Tailwind template
    const emailHtml = await render(
      React.createElement(BaseEmail, {
        content: personalizedHtmlRaw,
        previewText: personalizedSubject,
        senderName: senderDisplayName
      })
    );

    try {
      const info = await transporter.sendMail({
        from,
        to: recipient,
        subject: personalizedSubject,
        html: emailHtml,
      });
      results.sentCount++;
      results.messageIds.push(info.messageId);
    } catch (error) {
      console.error(`Failed to send email to ${recipient}:`, error);
      results.failedCount++;
      results.errors.push({ email: recipient, error });
    }
  }

  transporter.close();

  results.success = results.failedCount === 0;
  return results;
};

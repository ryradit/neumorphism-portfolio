'use client';

import emailjs from '@emailjs/browser';

// These values should be replaced with your actual EmailJS service details
// You can set these in your .env file and access them using process.env
const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '';
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '';
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '';

interface EmailData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const EmailService = {
  sendEmail: async (data: EmailData): Promise<void> => {
    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      throw new Error('Email service configuration is missing');
    }
    
    const templateParams = {
      from_name: data.name,
      from_email: data.email,
      subject: data.subject || `New contact from ${data.name}`,
      message: data.message,
      reply_to: data.email,
    };
    
    try {
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        templateParams,
        PUBLIC_KEY
      );
    } catch (error) {
      console.error('Email sending failed:', error);
      throw new Error('Failed to send email. Please try again later.');
    }
  },
};

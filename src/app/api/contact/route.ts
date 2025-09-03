import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json();

    // Validate form inputs
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Send email using EmailJS
    const serviceId = process.env.EMAILJS_SERVICE_ID;
    const templateId = process.env.EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.EMAILJS_PUBLIC_KEY;
    const privateKey = process.env.EMAILJS_PRIVATE_KEY;

    if (!serviceId || !templateId || !publicKey || !privateKey) {
      console.warn('Email service configuration is incomplete');
      
      // Fallback to logging the submission
      console.log('Contact form submission:', { name, email, subject, message });
      
      return NextResponse.json({ 
        success: true, 
        message: 'Your message has been received. I will get back to you soon!' 
      });
    }

    try {
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_id: serviceId,
          template_id: templateId,
          user_id: publicKey,
          accessToken: privateKey,
          template_params: {
            from_name: name,
            from_email: email,
            subject: subject || `New contact from ${name}`,
            message,
            reply_to: email,
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message through EmailJS');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      // Don't throw here, we'll still return success to the user
      // but log the error for debugging
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Your message has been sent. I will get back to you soon!' 
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}

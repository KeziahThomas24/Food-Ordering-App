// pages/api/sendEmail.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    if (req.method !== 'POST') {
      return NextResponse.json({ error: 'Method Not Allowed' });
    }

    const data = await req.formData();
    const email = data.get('email');
    const name = data.get('name');

    // Check if email is provided
    if (!email) {
      return NextResponse.json({ error: 'Email address is required' });
    }

    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: 'stpizza.info@gmail.com',
        pass: 'hvnh wxuv ltrg kjoy', // Use the provided app-specific password
      },
    });

    // Email content
    const mailOptions = {
      from: 'stpizza.info@gmail.com',
      to: email as string,
      subject: 'Thank you for contacting us!',
      html: `
        <h2>Dear ${name},</h2>
        <p><b>Thank you for contacting us! We have received your message and will reply to you at the earliest.</b></p>
        <p><b>Best regards,<br>PizzaBox<b></p>
        <img src="cid:pizzabox" alt="Pizza Box">
      `,
      attachments: [{
        filename: 'pizzabox.png',
        path: './public/pizzabox.png',
        cid: 'pizzabox' // Content ID to link the image
      }]
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Failed to send email' });
  }
}

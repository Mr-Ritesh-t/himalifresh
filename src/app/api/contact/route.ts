import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { contactSchema } from '@/lib/validations';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import { sendContactFormEmails } from '@/lib/brevo';

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rateCheck = checkRateLimit(`contact:${ip}`, 5, 10 * 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many messages sent. Please wait a few minutes before submitting again.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const validationResult = contactSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          issues: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, email, phone, subject, message } = validationResult.data;

    const contactMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        phone,
        subject,
        message,
      },
    });

    // Send Brevo email notifications (Store Admin Alert + Customer Acknowledgement)
    await sendContactFormEmails({
      name,
      email,
      phone,
      subject,
      message,
    }).catch((err) => console.error('[Brevo Contact Form Error]', err));

    return NextResponse.json({
      success: true,
      message: 'Your message has been sent successfully. We will contact you shortly.',
      id: contactMessage.id,
    });
  } catch (error: any) {
    console.error('Error submitting contact form:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send message' },
      { status: 500 }
    );
  }
}

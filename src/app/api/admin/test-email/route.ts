import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { sendBrevoEmail } from '@/lib/brevo';

export async function POST(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const recipient = body.recipient || process.env.BREVO_ADMIN_EMAIL || 'riteshtayade68@gmail.com';

    const apiKey = process.env.BREVO_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'BREVO_API_KEY is not set in environment variables (Vercel / .env).',
        apiKeyConfigured: false,
      });
    }

    const senderEmail = process.env.BREVO_SENDER_EMAIL || process.env.NEXT_PUBLIC_BUSINESS_EMAIL || 'riteshtayade68@gmail.com';
    const senderName = process.env.BREVO_SENDER_NAME || 'Himali Fresh';

    // Call Brevo directly to capture full raw response
    const payload = {
      sender: {
        name: senderName,
        email: senderEmail,
      },
      to: [{ email: recipient.trim(), name: 'Himali Fresh Admin' }],
      subject: '🌿 Himali Fresh Brevo Test Email',
      htmlContent: `
        <div style="font-family: sans-serif; padding: 20px; color: #1E293B;">
          <h2 style="color: #064B32;">🌿 Himali Fresh Brevo Integration Test</h2>
          <p>Congratulations! Your Brevo transactional email service is configured and sending successfully.</p>
          <div style="background: #F8F5F0; padding: 15px; border-radius: 8px; border: 1px solid #E2D9C8;">
            <div><strong>Sender:</strong> ${senderName} &lt;${senderEmail}&gt;</div>
            <div><strong>Recipient:</strong> ${recipient}</div>
            <div><strong>Sent at:</strong> ${new Date().toISOString()}</div>
          </div>
        </div>
      `,
    };

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return NextResponse.json({
        success: false,
        statusCode: response.status,
        error: data.message || `Brevo API returned status ${response.status}`,
        details: data,
        senderUsed: senderEmail,
      });
    }

    return NextResponse.json({
      success: true,
      messageId: data.messageId,
      recipient,
      senderUsed: senderEmail,
      message: 'Test email successfully sent via Brevo! Please check your inbox and Spam folder.',
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error?.message || 'Failed to send test email',
    }, { status: 500 });
  }
}

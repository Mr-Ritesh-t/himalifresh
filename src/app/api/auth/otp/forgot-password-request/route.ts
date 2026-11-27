import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createOtpChallenge, OTP_PURPOSES } from '@/lib/otp';
import { sendOtpEmail } from '@/lib/brevo';
import { checkDistributedRateLimit, getClientIp } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rateCheck = await checkDistributedRateLimit(`customer-forgot-pw:${ip}`, 5, 10 * 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please wait a few minutes before trying again.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { email } = body;

    if (!email?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Email address is required.' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Generic response message to prevent email enumeration
    const genericResponse = {
      success: true,
      message: 'If an account exists with this email, a 6-digit verification code will be sent.',
    };

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      // Do not reveal that email does not exist
      return NextResponse.json(genericResponse);
    }

    const challenge = await createOtpChallenge({
      email: normalizedEmail,
      purpose: OTP_PURPOSES.CUSTOMER_PASSWORD_RESET,
      metadata: { userId: user.id },
    });

    if (!challenge.success || !challenge.challengeId || !challenge.otp) {
      if (challenge.cooldownSeconds) {
        return NextResponse.json(
          { success: false, error: challenge.error },
          { status: 429 }
        );
      }
      return NextResponse.json(genericResponse);
    }

    // Send OTP email via Brevo
    await sendOtpEmail({
      toEmail: normalizedEmail,
      recipientName: user.name,
      otp: challenge.otp,
      purpose: OTP_PURPOSES.CUSTOMER_PASSWORD_RESET,
      expiresMinutes: 5,
    }).catch((err) => console.error('[Brevo Password Reset Error]', err));

    return NextResponse.json({
      ...genericResponse,
      challengeId: challenge.challengeId,
      cooldownSeconds: challenge.cooldownSeconds || 60,
    });
  } catch (error: any) {
    console.error('Customer forgot password request error:', error);
    return NextResponse.json(
      { success: false, error: 'Unable to process request. Please try again.' },
      { status: 500 }
    );
  }
}

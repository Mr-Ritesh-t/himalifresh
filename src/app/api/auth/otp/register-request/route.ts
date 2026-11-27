import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';
import { createOtpChallenge, OTP_PURPOSES } from '@/lib/otp';
import { sendOtpEmail } from '@/lib/brevo';
import { checkDistributedRateLimit, getClientIp } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rateCheck = await checkDistributedRateLimit(`otp-register:${ip}`, 5, 10 * 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many registration attempts. Please wait a few minutes before trying again.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { name, email, phone, password } = body;

    if (!name?.trim() || !email?.trim() || !password) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and password are required.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters.' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if account already exists
    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'An account with this email already exists. Please sign in.' },
        { status: 409 }
      );
    }

    // Pre-hash password so plaintext is never stored even in challenge metadata
    const passwordHash = await hashPassword(password);

    const challenge = await createOtpChallenge({
      email: normalizedEmail,
      purpose: OTP_PURPOSES.CUSTOMER_REGISTRATION,
      metadata: {
        name: name.trim(),
        email: normalizedEmail,
        phone: phone?.trim() || null,
        passwordHash,
      },
    });

    if (!challenge.success || !challenge.challengeId || !challenge.otp) {
      return NextResponse.json(
        { success: false, error: challenge.error || 'Failed to initialize verification.' },
        { status: challenge.cooldownSeconds ? 429 : 500 }
      );
    }

    // Send OTP via Brevo (never expose OTP in response)
    const emailResult = await sendOtpEmail({
      toEmail: normalizedEmail,
      recipientName: name.trim(),
      otp: challenge.otp,
      purpose: OTP_PURPOSES.CUSTOMER_REGISTRATION,
      expiresMinutes: 5,
    });

    if (!emailResult.success && !emailResult.skipped) {
      console.error('[Brevo OTP Send Failure]', emailResult.error);
    }

    return NextResponse.json({
      success: true,
      challengeId: challenge.challengeId,
      cooldownSeconds: challenge.cooldownSeconds || 60,
      message: `A 6-digit verification code has been sent to ${normalizedEmail}.`,
    });
  } catch (error: any) {
    console.error('Registration OTP request error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to initiate registration verification. Please try again.' },
      { status: 500 }
    );
  }
}

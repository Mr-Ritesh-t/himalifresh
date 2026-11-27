import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyOtpChallenge, OTP_PURPOSES } from '@/lib/otp';
import { createUserToken, USER_TOKEN_COOKIE_NAME } from '@/lib/auth';
import { sendWelcomeEmail } from '@/lib/brevo';
import { checkDistributedRateLimit, getClientIp } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rateCheck = await checkDistributedRateLimit(`otp-verify:${ip}`, 10, 5 * 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many verification attempts. Please wait a few minutes before trying again.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { challengeId, otp } = body;

    if (!challengeId || !otp?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Challenge ID and 6-digit verification code are required.' },
        { status: 400 }
      );
    }

    const result = await verifyOtpChallenge({
      challengeId,
      otp: otp.trim(),
      expectedPurpose: OTP_PURPOSES.CUSTOMER_REGISTRATION,
    });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Invalid verification code.',
          remainingAttempts: result.remainingAttempts,
        },
        { status: 400 }
      );
    }

    const metadata = result.metadata;
    if (!metadata || !metadata.email || !metadata.passwordHash || !metadata.name) {
      return NextResponse.json(
        { success: false, error: 'Registration metadata missing or expired. Please register again.' },
        { status: 400 }
      );
    }

    // Check once more for race conditions
    const existing = await prisma.user.findUnique({
      where: { email: metadata.email },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'An account with this email already exists. Please sign in.' },
        { status: 409 }
      );
    }

    // Create user only after successful OTP verification
    const user = await prisma.user.create({
      data: {
        name: metadata.name,
        email: metadata.email,
        phone: metadata.phone || null,
        passwordHash: metadata.passwordHash,
        emailVerified: true,
        tokenVersion: 0,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        city: true,
        pincode: true,
        createdAt: true,
      },
    });

    // Send welcome email (awaited for Cloudflare Workers)
    await sendWelcomeEmail({
      name: user.name,
      email: user.email,
    }).catch((err) => console.error('[Brevo Welcome Email Error]', err));

    // Issue JWT session cookie
    const token = await createUserToken({
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      tokenVersion: 0,
    });

    const response = NextResponse.json({
      success: true,
      message: 'Email verified and account created successfully!',
      user,
    });

    response.cookies.set({
      name: USER_TOKEN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error('Registration verification error:', error);
    return NextResponse.json(
      { success: false, error: 'Verification failed. Please try again.' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { resendOtpChallenge } from '@/lib/otp';
import { sendOtpEmail } from '@/lib/brevo';
import { checkDistributedRateLimit, getClientIp } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rateCheck = await checkDistributedRateLimit(`otp-resend:${ip}`, 5, 5 * 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many resend attempts. Please wait a few minutes before trying again.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { challengeId } = body;

    if (!challengeId) {
      return NextResponse.json(
        { success: false, error: 'Challenge ID is required to resend code.' },
        { status: 400 }
      );
    }

    const result = await resendOtpChallenge(challengeId);

    if (!result.success || !result.otp || !result.email || !result.purpose) {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to resend code.' },
        { status: result.cooldownSeconds ? 429 : 400 }
      );
    }

    // Send new OTP via Brevo
    const emailResult = await sendOtpEmail({
      toEmail: result.email,
      otp: result.otp,
      purpose: result.purpose,
      expiresMinutes: 5,
    });

    if (!emailResult.success && !emailResult.skipped) {
      console.error('[Brevo OTP Resend Error]', emailResult.error);
    }

    return NextResponse.json({
      success: true,
      cooldownSeconds: result.cooldownSeconds || 60,
      message: 'A new 6-digit verification code has been sent.',
    });
  } catch (error: any) {
    console.error('Resend OTP error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to resend verification code. Please try again.' },
      { status: 500 }
    );
  }
}

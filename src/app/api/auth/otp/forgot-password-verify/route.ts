import { NextRequest, NextResponse } from 'next/server';
import { verifyOtpChallenge, createPasswordResetToken, OTP_PURPOSES } from '@/lib/otp';
import { checkDistributedRateLimit, getClientIp } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rateCheck = await checkDistributedRateLimit(`customer-verify-reset:${ip}`, 10, 5 * 60 * 1000);
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
      expectedPurpose: OTP_PURPOSES.CUSTOMER_PASSWORD_RESET,
    });

    if (!result.success || !result.email) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Invalid verification code.',
          remainingAttempts: result.remainingAttempts,
        },
        { status: 400 }
      );
    }

    // Generate signed, short-lived reset token (valid for 10 minutes)
    const resetToken = await createPasswordResetToken({
      challengeId,
      email: result.email,
      purpose: 'CUSTOMER_PASSWORD_RESET',
    });

    return NextResponse.json({
      success: true,
      message: 'Code verified successfully.',
      resetToken,
    });
  } catch (error: any) {
    console.error('Customer forgot password verify error:', error);
    return NextResponse.json(
      { success: false, error: 'Verification failed. Please try again.' },
      { status: 500 }
    );
  }
}

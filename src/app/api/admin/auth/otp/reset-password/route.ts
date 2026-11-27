import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';
import { verifyPasswordResetToken, OTP_PURPOSES } from '@/lib/otp';
import { checkDistributedRateLimit, getClientIp } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rateCheck = await checkDistributedRateLimit(`admin-reset-pw:${ip}`, 5, 5 * 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many attempts. Please wait a few minutes before trying again.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { resetToken, newPassword } = body;

    if (!resetToken || !newPassword) {
      return NextResponse.json(
        { success: false, error: 'Reset token and new password are required.' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters.' },
        { status: 400 }
      );
    }

    // Verify reset token signature and purpose (strictly ADMIN_PASSWORD_RESET)
    // Customer reset token CANNOT reset admin password!
    const tokenPayload = await verifyPasswordResetToken(resetToken, 'ADMIN_PASSWORD_RESET');
    if (!tokenPayload) {
      return NextResponse.json(
        { success: false, error: 'Admin reset session is invalid or has expired. Please restart the forgot password process.' },
        { status: 400 }
      );
    }

    const newPasswordHash = await hashPassword(newPassword);

    // Update admin user password and increment tokenVersion to invalidate existing active admin sessions
    await prisma.adminUser.update({
      where: { email: tokenPayload.email },
      data: {
        passwordHash: newPasswordHash,
        tokenVersion: { increment: 1 },
      },
    });

    // Invalidate any remaining active password reset challenges for this admin
    await prisma.$executeRawUnsafe(
      `UPDATE "OtpChallenge" SET "consumedAt" = NOW() WHERE "email" = $1 AND "purpose" = $2 AND "consumedAt" IS NULL`,
      tokenPayload.email,
      OTP_PURPOSES.ADMIN_PASSWORD_RESET
    );

    return NextResponse.json({
      success: true,
      message: 'Admin password reset successfully. Please sign in with your new password.',
    });
  } catch (error: any) {
    console.error('Admin reset password error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to reset password. Please try again.' },
      { status: 500 }
    );
  }
}

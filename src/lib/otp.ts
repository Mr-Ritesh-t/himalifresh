import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { prisma } from './prisma';

export const OTP_PURPOSES = {
  CUSTOMER_REGISTRATION: 'CUSTOMER_REGISTRATION',
  CUSTOMER_PASSWORD_RESET: 'CUSTOMER_PASSWORD_RESET',
  ADMIN_PASSWORD_RESET: 'ADMIN_PASSWORD_RESET',
} as const;

export type OtpPurpose = typeof OTP_PURPOSES[keyof typeof OTP_PURPOSES];

export const OTP_CONFIG = {
  LENGTH: 6,
  EXPIRY_MS: 5 * 60 * 1000, // 5 minutes
  COOLDOWN_MS: 60 * 1000,    // 60 seconds
  MAX_ATTEMPTS: 5,
};

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret && process.env.NODE_ENV === 'production') {
    throw new Error('FATAL: JWT_SECRET environment variable must be set in production.');
  }
  return new TextEncoder().encode(
    secret || 'himali_fresh_local_dev_only_secret_key'
  );
}

/**
 * Generates a cryptographically secure 6-digit numeric OTP string
 */
export function generateNumericOtp(): string {
  return crypto.randomInt(100000, 1000000).toString();
}

/**
 * Hashes OTP securely using bcrypt
 */
export async function hashOtp(otp: string): Promise<string> {
  return bcrypt.hash(otp, 10);
}

/**
 * Compares plaintext OTP against the stored hash
 */
export async function verifyOtpHash(otp: string, hash: string): Promise<boolean> {
  return bcrypt.compare(otp, hash);
}

/**
 * Creates an OTP challenge record in the database.
 * Enforces 60-second cooldown per email + purpose and invalidates prior unconsumed challenges.
 */
export async function createOtpChallenge(params: {
  email: string;
  purpose: OtpPurpose;
  metadata?: Record<string, any>;
}): Promise<{
  success: boolean;
  challengeId?: string;
  otp?: string;
  cooldownSeconds?: number;
  error?: string;
}> {
  const normalizedEmail = params.email.trim().toLowerCase();
  const now = new Date();

  // Check cooldown on the latest active challenge for this email and purpose
  const latestChallenge = await prisma.otpChallenge.findFirst({
    where: {
      email: normalizedEmail,
      purpose: params.purpose,
      consumedAt: null,
    },
    orderBy: { createdAt: 'desc' },
  });

  if (latestChallenge) {
    const elapsedMs = now.getTime() - latestChallenge.lastSentAt.getTime();
    if (elapsedMs < OTP_CONFIG.COOLDOWN_MS) {
      const waitSeconds = Math.ceil((OTP_CONFIG.COOLDOWN_MS - elapsedMs) / 1000);
      return {
        success: false,
        error: `Please wait ${waitSeconds} second(s) before requesting a new code.`,
        cooldownSeconds: waitSeconds,
      };
    }
  }

  // Invalidate any previous unconsumed challenges for this email and purpose
  // Note: We use executeRawUnsafe because PrismaNeonHTTP does not support transactions in updateMany
  await prisma.$executeRawUnsafe(
    `UPDATE "OtpChallenge" SET "consumedAt" = NOW() WHERE "email" = $1 AND "purpose" = $2 AND "consumedAt" IS NULL`,
    normalizedEmail,
    params.purpose
  );

  // Generate new OTP and hash
  const otp = generateNumericOtp();
  const otpHash = await hashOtp(otp);
  const expiresAt = new Date(now.getTime() + OTP_CONFIG.EXPIRY_MS);

  const challenge = await prisma.otpChallenge.create({
    data: {
      email: normalizedEmail,
      purpose: params.purpose,
      otpHash,
      metadata: params.metadata ? JSON.stringify(params.metadata) : null,
      expiresAt,
      lastSentAt: now,
      failedAttempts: 0,
    },
  });

  return {
    success: true,
    challengeId: challenge.id,
    otp, // Returned to caller for sending via Brevo; NEVER return this to API responses
    cooldownSeconds: 60,
  };
}

/**
 * Resends OTP for an existing valid challenge with cooldown enforcement
 */
export async function resendOtpChallenge(challengeId: string): Promise<{
  success: boolean;
  otp?: string;
  cooldownSeconds?: number;
  error?: string;
  email?: string;
  purpose?: OtpPurpose;
}> {
  const now = new Date();
  const challenge = await prisma.otpChallenge.findUnique({
    where: { id: challengeId },
  });

  if (!challenge || challenge.consumedAt !== null) {
    return { success: false, error: 'Verification session has expired or is invalid. Please start again.' };
  }

  const elapsedMs = now.getTime() - challenge.lastSentAt.getTime();
  if (elapsedMs < OTP_CONFIG.COOLDOWN_MS) {
    const waitSeconds = Math.ceil((OTP_CONFIG.COOLDOWN_MS - elapsedMs) / 1000);
    return {
      success: false,
      error: `Please wait ${waitSeconds} second(s) before resending code.`,
      cooldownSeconds: waitSeconds,
    };
  }

  const newOtp = generateNumericOtp();
  const newOtpHash = await hashOtp(newOtp);
  const newExpiresAt = new Date(now.getTime() + OTP_CONFIG.EXPIRY_MS);

  await prisma.otpChallenge.update({
    where: { id: challengeId },
    data: {
      otpHash: newOtpHash,
      lastSentAt: now,
      expiresAt: newExpiresAt,
      failedAttempts: 0,
    },
  });

  return {
    success: true,
    otp: newOtp,
    cooldownSeconds: 60,
    email: challenge.email,
    purpose: challenge.purpose as OtpPurpose,
  };
}

/**
 * Verifies an OTP challenge against the stored hash and enforces attempt limits.
 * Marks the challenge as consumed atomically upon success.
 */
export async function verifyOtpChallenge(params: {
  challengeId: string;
  otp: string;
  expectedPurpose: OtpPurpose;
}): Promise<{
  success: boolean;
  error?: string;
  remainingAttempts?: number;
  email?: string;
  metadata?: any;
}> {
  const { challengeId, otp, expectedPurpose } = params;
  const now = new Date();

  const challenge = await prisma.otpChallenge.findUnique({
    where: { id: challengeId },
  });

  if (!challenge) {
    return { success: false, error: 'Verification session not found. Please request a new code.' };
  }

  if (challenge.consumedAt !== null) {
    return { success: false, error: 'This verification code has already been used. Please request a new code.' };
  }

  if (challenge.purpose !== expectedPurpose) {
    return { success: false, error: 'Invalid verification session.' };
  }

  if (challenge.expiresAt < now) {
    return { success: false, error: 'Verification code has expired. Please request a new code.' };
  }

  if (challenge.failedAttempts >= OTP_CONFIG.MAX_ATTEMPTS) {
    return {
      success: false,
      error: 'Too many incorrect attempts. For security, this code has been deactivated. Please request a new code.',
      remainingAttempts: 0,
    };
  }

  const isMatch = await verifyOtpHash(otp.trim(), challenge.otpHash);

  if (!isMatch) {
    const updatedAttempts = challenge.failedAttempts + 1;
    const remaining = Math.max(0, OTP_CONFIG.MAX_ATTEMPTS - updatedAttempts);

    await prisma.otpChallenge.update({
      where: { id: challengeId },
      data: { failedAttempts: updatedAttempts },
    });

    if (remaining === 0) {
      return {
        success: false,
        error: 'Too many incorrect attempts. For security, this code has been deactivated. Please request a new code.',
        remainingAttempts: 0,
      };
    }

    return {
      success: false,
      error: `Incorrect verification code. ${remaining} attempt(s) remaining.`,
      remainingAttempts: remaining,
    };
  }

  // Atomically mark the challenge consumed
  await prisma.otpChallenge.update({
    where: { id: challengeId },
    data: { consumedAt: now },
  });

  let parsedMetadata: any = null;
  if (challenge.metadata) {
    try {
      parsedMetadata = JSON.parse(challenge.metadata);
    } catch {
      parsedMetadata = null;
    }
  }

  return {
    success: true,
    email: challenge.email,
    metadata: parsedMetadata,
  };
}

/**
 * Creates a cryptographically signed password reset token (valid for 10 minutes)
 * returned after OTP verification to safely transition to new password entry.
 */
export async function createPasswordResetToken(payload: {
  challengeId: string;
  email: string;
  purpose: 'CUSTOMER_PASSWORD_RESET' | 'ADMIN_PASSWORD_RESET';
}): Promise<string> {
  return new SignJWT({
    ...payload,
    isPasswordReset: true,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('10m')
    .sign(getJwtSecret());
}

/**
 * Verifies a password reset token
 */
export async function verifyPasswordResetToken(
  token: string,
  expectedPurpose: 'CUSTOMER_PASSWORD_RESET' | 'ADMIN_PASSWORD_RESET'
): Promise<{ challengeId: string; email: string; purpose: string } | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    if (
      payload.isPasswordReset !== true ||
      payload.purpose !== expectedPurpose ||
      !payload.email ||
      !payload.challengeId
    ) {
      return null;
    }
    return {
      challengeId: String(payload.challengeId),
      email: String(payload.email),
      purpose: String(payload.purpose),
    };
  } catch {
    return null;
  }
}

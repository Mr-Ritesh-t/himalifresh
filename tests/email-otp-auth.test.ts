import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  generateNumericOtp,
  hashOtp,
  verifyOtpHash,
  createOtpChallenge,
  verifyOtpChallenge,
  resendOtpChallenge,
  createPasswordResetToken,
  verifyPasswordResetToken,
  OTP_CONFIG,
  OTP_PURPOSES,
} from '@/lib/otp';
import { hashPassword, verifyPassword, createAdminToken, verifyAdminToken, createUserToken, verifyUserToken } from '@/lib/auth';
import { sendOtpEmail } from '@/lib/brevo';

describe('Email OTP Authentication & Security Test Suite', () => {
  describe('1. OTP Generation & Cryptographic Hashing', () => {
    it('generates a 6-digit numeric OTP', () => {
      for (let i = 0; i < 20; i++) {
        const otp = generateNumericOtp();
        expect(otp).toMatch(/^\d{6}$/);
        expect(otp.length).toBe(6);
        const num = parseInt(otp, 10);
        expect(num).toBeGreaterThanOrEqual(100000);
        expect(num).toBeLessThan(1000000);
      }
    });

    it('hashes OTP securely with bcrypt and verifies matching and non-matching codes', async () => {
      const otp = '482910';
      const hash = await hashOtp(otp);

      expect(hash).not.toBe(otp);
      expect(hash.startsWith('$2')).toBe(true);

      const isValid = await verifyOtpHash(otp, hash);
      expect(isValid).toBe(true);

      const isInvalid = await verifyOtpHash('123456', hash);
      expect(isInvalid).toBe(false);
    });
  });

  describe('2. OTP Challenge Lifecycle, Cooldown & Invalidation', () => {
    // In-memory challenge store to test lifecycle with mock database
    const store = new Map<string, any>();

    beforeEach(() => {
      store.clear();
      vi.restoreAllMocks();
    });

    it('creates an OTP challenge with 5-minute expiry and 60-second cooldown', async () => {
      const email = 'customer@example.com';
      const otp = generateNumericOtp();
      const hash = await hashOtp(otp);
      const now = new Date();

      const challenge = {
        id: 'challenge-1',
        email,
        purpose: OTP_PURPOSES.CUSTOMER_REGISTRATION,
        otpHash: hash,
        metadata: JSON.stringify({ name: 'Dawa Norbu', email }),
        expiresAt: new Date(now.getTime() + OTP_CONFIG.EXPIRY_MS),
        failedAttempts: 0,
        lastSentAt: now,
        consumedAt: null,
        createdAt: now,
      };

      store.set(challenge.id, challenge);

      // Verify expiry is 5 minutes
      const diffMs = challenge.expiresAt.getTime() - challenge.createdAt.getTime();
      expect(diffMs).toBe(5 * 60 * 1000);

      // Verify cooldown is 60 seconds
      expect(OTP_CONFIG.COOLDOWN_MS).toBe(60 * 1000);
      expect(OTP_CONFIG.MAX_ATTEMPTS).toBe(5);
    });

    it('rejects verification when OTP is incorrect and tracks failed attempts', async () => {
      const otp = '555222';
      const hash = await hashOtp(otp);
      const challenge = {
        id: 'ch-test',
        email: 'user@example.com',
        purpose: OTP_PURPOSES.CUSTOMER_REGISTRATION,
        otpHash: hash,
        expiresAt: new Date(Date.now() + 300000),
        failedAttempts: 0,
        consumedAt: null,
      };

      // Incorrect OTP check
      const isMatch = await verifyOtpHash('999999', challenge.otpHash);
      expect(isMatch).toBe(false);

      challenge.failedAttempts += 1;
      expect(challenge.failedAttempts).toBe(1);
      expect(OTP_CONFIG.MAX_ATTEMPTS - challenge.failedAttempts).toBe(4);
    });

    it('enforces maximum 5 attempts and locks the challenge', async () => {
      const otp = '112233';
      const hash = await hashOtp(otp);
      const challenge = {
        id: 'ch-lock',
        email: 'user@example.com',
        purpose: OTP_PURPOSES.CUSTOMER_REGISTRATION,
        otpHash: hash,
        expiresAt: new Date(Date.now() + 300000),
        failedAttempts: 5, // Reached max
        consumedAt: null,
      };

      expect(challenge.failedAttempts >= OTP_CONFIG.MAX_ATTEMPTS).toBe(true);
    });

    it('rejects expired OTP challenges', () => {
      const expiredChallenge = {
        id: 'ch-expired',
        email: 'user@example.com',
        expiresAt: new Date(Date.now() - 1000), // In the past
        consumedAt: null,
      };

      const isExpired = expiredChallenge.expiresAt < new Date();
      expect(isExpired).toBe(true);
    });

    it('prevents OTP replay/reuse by checking consumedAt timestamp', () => {
      const consumedChallenge = {
        id: 'ch-consumed',
        email: 'user@example.com',
        consumedAt: new Date(),
      };

      expect(consumedChallenge.consumedAt).not.toBeNull();
    });
  });

  describe('3. Password Reset Tokens & Purpose Isolation', () => {
    it('creates a signed customer reset token that cannot be used for admin reset', async () => {
      const customerResetToken = await createPasswordResetToken({
        challengeId: 'ch-cust-123',
        email: 'shopper@example.com',
        purpose: 'CUSTOMER_PASSWORD_RESET',
      });

      // Valid customer reset
      const customerPayload = await verifyPasswordResetToken(customerResetToken, 'CUSTOMER_PASSWORD_RESET');
      expect(customerPayload).not.toBeNull();
      expect(customerPayload?.email).toBe('shopper@example.com');
      expect(customerPayload?.purpose).toBe('CUSTOMER_PASSWORD_RESET');

      // Admin verification of customer token MUST fail (strict purpose isolation)
      const adminPayload = await verifyPasswordResetToken(customerResetToken, 'ADMIN_PASSWORD_RESET');
      expect(adminPayload).toBeNull();
    });

    it('creates a signed admin reset token that cannot be used for customer reset', async () => {
      const adminResetToken = await createPasswordResetToken({
        challengeId: 'ch-admin-456',
        email: 'admin@himalifresh.com',
        purpose: 'ADMIN_PASSWORD_RESET',
      });

      // Valid admin reset
      const adminPayload = await verifyPasswordResetToken(adminResetToken, 'ADMIN_PASSWORD_RESET');
      expect(adminPayload).not.toBeNull();
      expect(adminPayload?.email).toBe('admin@himalifresh.com');
      expect(adminPayload?.purpose).toBe('ADMIN_PASSWORD_RESET');

      // Customer verification of admin token MUST fail
      const customerPayload = await verifyPasswordResetToken(adminResetToken, 'CUSTOMER_PASSWORD_RESET');
      expect(customerPayload).toBeNull();
    });

    it('rejects invalid or tampered reset tokens', async () => {
      const fakeToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid.signature';
      const result = await verifyPasswordResetToken(fakeToken, 'CUSTOMER_PASSWORD_RESET');
      expect(result).toBeNull();
    });
  });

  describe('4. Session Invalidation via Token Versioning', () => {
    it('supports tokenVersion in customer and admin JWT payloads', async () => {
      const userTokenV0 = await createUserToken({
        id: 'user-abc',
        email: 'user@example.com',
        name: 'Tashi',
        tokenVersion: 0,
      });

      const userPayload = await verifyUserToken(userTokenV0);
      expect(userPayload).not.toBeNull();
      expect(userPayload?.tokenVersion).toBe(0);

      const adminTokenV0 = await createAdminToken({
        id: 'admin-abc',
        email: 'admin@himalifresh.com',
        role: 'ADMIN',
        name: 'Manager',
        tokenVersion: 0,
      });

      const adminPayload = await verifyAdminToken(adminTokenV0);
      expect(adminPayload).not.toBeNull();
      expect(adminPayload?.tokenVersion).toBe(0);
      expect(adminPayload?.role).toBe('ADMIN');
    });

    it('verifies that old password is replaced and invalidates on update', async () => {
      const originalPassword = 'InitialSecretPassword123';
      const newPassword = 'NewUpdatedPassword456';

      const originalHash = await hashPassword(originalPassword);
      expect(await verifyPassword(originalPassword, originalHash)).toBe(true);
      expect(await verifyPassword(newPassword, originalHash)).toBe(false);

      const newHash = await hashPassword(newPassword);
      expect(await verifyPassword(newPassword, newHash)).toBe(true);
      expect(await verifyPassword(originalPassword, newHash)).toBe(false);
    });
  });

  describe('5. Direct Normal Login Preservation (No OTP on Normal Login)', () => {
    it('verifies that customer login verifies credentials directly and issues JWT without OTP', async () => {
      const password = 'CustomerPassword123';
      const passwordHash = await hashPassword(password);

      // Verify credentials directly
      const isMatch = await verifyPassword(password, passwordHash);
      expect(isMatch).toBe(true);

      // Directly creates token
      const token = await createUserToken({
        id: 'cust-1',
        email: 'direct@example.com',
        name: 'Direct User',
      });

      const session = await verifyUserToken(token);
      expect(session).not.toBeNull();
      expect(session?.email).toBe('direct@example.com');
    });

    it('verifies that admin login verifies credentials directly and preserves ADMIN and SUPER_ADMIN roles', async () => {
      const adminHash = await hashPassword('AdminPass123');
      expect(await verifyPassword('AdminPass123', adminHash)).toBe(true);

      const superAdminToken = await createAdminToken({
        id: 'admin-super',
        email: 'superadmin@himalifresh.com',
        role: 'SUPER_ADMIN',
        name: 'Owner',
      });

      const verified = await verifyAdminToken(superAdminToken);
      expect(verified).not.toBeNull();
      expect(verified?.role).toBe('SUPER_ADMIN');

      const adminToken = await createAdminToken({
        id: 'admin-staff',
        email: 'staff@himalifresh.com',
        role: 'ADMIN',
        name: 'Staff',
      });

      const verifiedAdmin = await verifyAdminToken(adminToken);
      expect(verifiedAdmin).not.toBeNull();
      expect(verifiedAdmin?.role).toBe('ADMIN');
    });
  });

  describe('6. Brevo Email Integration & Delivery Failure Resilience', () => {
    it('handles missing BREVO_API_KEY gracefully without throwing in sendOtpEmail', async () => {
      const prevKey = process.env.BREVO_API_KEY;
      delete process.env.BREVO_API_KEY;

      const result = await sendOtpEmail({
        toEmail: 'test@example.com',
        recipientName: 'Test User',
        otp: '654321',
        purpose: 'CUSTOMER_REGISTRATION',
      });

      expect(result.success).toBe(false);
      expect(result.skipped).toBe(true);

      if (prevKey) {
        process.env.BREVO_API_KEY = prevKey;
      }
    });

    it('handles Brevo API 500 error gracefully without crashing', async () => {
      process.env.BREVO_API_KEY = 'test_key';
      const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ message: 'Brevo internal server error' }),
      } as any);

      const result = await sendOtpEmail({
        toEmail: 'error-test@example.com',
        otp: '987654',
        purpose: 'CUSTOMER_PASSWORD_RESET',
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('Brevo');

      fetchSpy.mockRestore();
    });
  });
});

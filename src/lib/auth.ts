import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret && process.env.NODE_ENV === 'production') {
    throw new Error('FATAL: JWT_SECRET environment variable must be set in production.');
  }
  return new TextEncoder().encode(
    secret || 'himali_fresh_local_dev_only_secret_key'
  );
}

const TOKEN_COOKIE_NAME = 'himali_admin_token';
const TOKEN_EXPIRY = '7d';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createAdminToken(payload: { id: string; email: string; role: string; name: string }): Promise<string> {
  return new SignJWT({ ...payload, isAdmin: true })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(getJwtSecret());
}

export async function verifyAdminToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    if (payload.isUser === true) return null;
    if (payload.role !== 'ADMIN' && payload.role !== 'SUPER_ADMIN') return null;
    return payload as { id: string; email: string; role: string; name: string };
  } catch (error) {
    return null;
  }
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}

// ── CUSTOMER USER AUTHENTICATION ──
export const USER_TOKEN_COOKIE_NAME = 'himali_user_token';

export interface UserSessionPayload {
  id: string;
  email: string;
  name: string;
  phone?: string | null;
}

export async function createUserToken(payload: UserSessionPayload): Promise<string> {
  return new SignJWT({ ...payload, isUser: true })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(getJwtSecret());
}

export async function verifyUserToken(token: string): Promise<UserSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    if (payload.isUser !== true || !payload.id || !payload.email) return null;
    return {
      id: String(payload.id),
      email: String(payload.email),
      name: String(payload.name || ''),
      phone: payload.phone ? String(payload.phone) : null,
    };
  } catch (error) {
    return null;
  }
}

export async function getUserSession(): Promise<UserSessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(USER_TOKEN_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyUserToken(token);
}

export { TOKEN_COOKIE_NAME };
